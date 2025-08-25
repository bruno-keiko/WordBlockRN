package com.wordblockrn

import android.app.*
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*
import kotlin.math.roundToInt
import com.facebook.react.bridge.WritableMap

enum class ServiceState {
    INACTIVE,
    COUNTING_DOWN,
    BLOCKING
}

class AppBlockerService : Service() {

    private val TAG = "AppBlockerService"

    private lateinit var windowManager: WindowManager
    private lateinit var overlayView: View
    private var isOverlayShown = false

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var checkRunnable: Runnable
    private lateinit var countdownRunnable: Runnable
    private var targetTime: Long = 0

    private val CHECK_INTERVAL_MS = 1000L

    companion object {
        var isServiceRunning = false
        var currentState = ServiceState.INACTIVE
        const val NOTIFICATION_CHANNEL_ID = "AppBlockerServiceChannel"
        const val NOTIFICATION_ID = 1
        const val COUNTDOWN_EVENT_NAME = "onCountdownTick"
        // **NEW**: Define the name for our new event
        const val BLOCKING_STARTED_EVENT_NAME = "onBlockingStarted" 
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        if (isServiceRunning) {
            Log.d(TAG, "Service is already running. Ignoring new start command.")
            // Resend the current state to JS in case the app was closed
            val remainingMillis = targetTime - System.currentTimeMillis()
            if(remainingMillis > 0) {
                 sendEvent(COUNTDOWN_EVENT_NAME, Arguments.createMap().apply { putInt("remainingSeconds", (remainingMillis / 1000.0).roundToInt()) })
            } else {
                 sendEvent(BLOCKING_STARTED_EVENT_NAME, null)
            }
            return START_STICKY
        }
        isServiceRunning = true
        currentState = ServiceState.COUNTING_DOWN

        val delayMinutes = intent?.getIntExtra("delayMinutes", 0) ?: 0
        val delayMillis = delayMinutes * 60 * 1000L
        targetTime = System.currentTimeMillis() + delayMillis

        Log.d(TAG, "Service started. Blocking will begin in $delayMinutes minutes.")
        startForegroundService()

        checkRunnable = object : Runnable {
            override fun run() {
                // This log was already here from the previous step
                if (isUserOutsideOurApp()) showOverlay() else hideOverlay()
                handler.postDelayed(this, CHECK_INTERVAL_MS)
            }
        }

        countdownRunnable = object : Runnable {
            override fun run() {
                val remainingMillis = targetTime - System.currentTimeMillis()
                if (remainingMillis > 0) {
                    val remainingSeconds = (remainingMillis / 1000.0).roundToInt()
                    // **NEW LOGGING**: Log the remaining time every second.
                    Log.d(TAG, "Countdown Tick: $remainingSeconds seconds remaining.")
                    sendCountdownEvent(remainingSeconds)
                    handler.postDelayed(this, 1000L)
                } else {
                    Log.d(TAG, "Countdown finished. Starting app blocking check.")
                    sendCountdownEvent(0)
                    sendEvent(BLOCKING_STARTED_EVENT_NAME, null)
                    currentState = ServiceState.BLOCKING
                    handler.post(checkRunnable)
                }
            }
        }

        handler.post(countdownRunnable)
        return START_STICKY
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            val reactContext = (application as? ReactApplication)?.reactNativeHost?.reactInstanceManager?.currentReactContext
            if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send event $eventName to React Native.", e)
        }
    }
    
    // **ENHANCED LOGGING** in this function
    private fun isUserOutsideOurApp(): Boolean {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val time = System.currentTimeMillis()
        val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 10, time)

        if (stats != null && stats.isNotEmpty()) {
            val sortedStats = stats.toMutableList().sortedBy { it.lastTimeUsed }
            val currentApp = sortedStats.lastOrNull()?.packageName
            // This log shows which app the service sees in the foreground
            Log.d(TAG, "App Check -- Current foreground app: $currentApp")
            return currentApp != null && currentApp != packageName
        }
        return false
    }

    private fun sendCountdownEvent(remainingSeconds: Int) {
        try {
            val reactContext = (application as? ReactApplication)?.reactNativeHost?.reactInstanceManager?.currentReactContext
            if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
                val params = Arguments.createMap().apply { putInt("remainingSeconds", remainingSeconds) }
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(COUNTDOWN_EVENT_NAME, params)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to send countdown event to React Native.", e)
        }
    }

    // ... The rest of the file (showOverlay, hideOverlay, startForegroundService, onDestroy) is unchanged ...

    private fun showOverlay() {
        if (isOverlayShown) return
        Log.d(TAG, "App Check -- User is outside our app. SHOWING overlay.")
        isOverlayShown = true
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) { stopSelf(); return }
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        overlayView = LayoutInflater.from(this).inflate(R.layout.overlay_layout, null)
        val params = WindowManager.LayoutParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT, if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, PixelFormat.TRANSLUCENT).apply { gravity = Gravity.CENTER }
        overlayView.findViewById<Button>(R.id.openAppButton).setOnClickListener {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
            startActivity(launchIntent)
            hideOverlay()
        }
        windowManager.addView(overlayView, params)
    }

    private fun hideOverlay() {
        if (!isOverlayShown) return
        Log.d(TAG, "App Check -- User is inside our app. HIDING overlay.")
        isOverlayShown = false
        if (::overlayView.isInitialized) {
            windowManager.removeView(overlayView)
        }
    }

    private fun startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(NOTIFICATION_CHANNEL_ID, "App Blocker Service", NotificationManager.IMPORTANCE_LOW)
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        }
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val notification: Notification = Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("App Blocker Active")
            .setContentText("Monitoring app usage to keep you focused.")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
        startForeground(NOTIFICATION_ID, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Service is being destroyed. Stopping all runnables and removing overlay.")
        handler.removeCallbacks(countdownRunnable)
        handler.removeCallbacks(checkRunnable)
        isServiceRunning = false 
        currentState = ServiceState.INACTIVE
        hideOverlay()
    }
}