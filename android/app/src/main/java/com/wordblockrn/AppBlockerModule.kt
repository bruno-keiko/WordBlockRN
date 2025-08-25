package com.wordblockrn

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class AppBlockerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppBlocker"

    @ReactMethod
    fun startAppBlocking(delayMinutes: Int, promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, AppBlockerService::class.java).apply {
                putExtra("delayMinutes", delayMinutes)
            }
            reactApplicationContext.startService(intent)
            promise.resolve("App blocking service started with a ${delayMinutes} minute delay.")
        } catch (e: Exception) {
            promise.reject("START_SERVICE_ERROR", e)
        }
    }

    @ReactMethod
    fun stopAppBlocking(promise: Promise) {
        try {
            reactApplicationContext.stopService(Intent(reactApplicationContext, AppBlockerService::class.java))
            promise.resolve("App blocking service stopped.")
        } catch (e: Exception) {
            promise.reject("STOP_SERVICE_ERROR", e)
        }
    }

    @ReactMethod
    fun requestOverlayPermission(promise: Promise) {
        // ... (this method remains the same as before)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(reactApplicationContext)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${reactApplicationContext.packageName}")
                )
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
                promise.resolve("Permission screen opened")
            } else {
                promise.resolve("Permission already granted")
            }
        } else {
            promise.resolve("Permission not required for this Android version")
        }
    }

    // **NEW METHOD**: To request the usage stats permission
    @ReactMethod
    fun requestUsageStatsPermission(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve("Opened Usage Access Settings screen.")
        } catch (e: Exception) {
            promise.reject("USAGE_STATS_ERROR", "Could not open Usage Access Settings.")
        }
    }

    @ReactMethod
    fun getServiceStatus(promise: Promise) {
        // It reads the static 'currentState' from the service and returns its name as a string.
        promise.resolve(AppBlockerService.currentState.name)
    }
}