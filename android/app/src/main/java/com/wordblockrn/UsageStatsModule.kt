package com.wordblockrn

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private val context = reactContext
    private var usageStatsManager: UsageStatsManager? = null
    private var blockThresholdMinutes = 15 // Default threshold
    private var lastCheckTime = 0L
    
    // Development mode settings
    private var isDevelopmentMode = true // Set to false for production
    private var devBlockThresholdSeconds = 5 // 5 seconds for development
    private var devSessionStartTime = 0L
    
    init {
        usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    }

    override fun getName(): String {
        return "UsageStatsModule"
    }

    /**
     * Check if the app has Usage Stats permission
     */
    @ReactMethod
    fun hasUsageStatsPermission(promise: Promise) {
        try {
            val currentTime = System.currentTimeMillis()
            val stats = usageStatsManager?.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                currentTime - 1000 * 60, // 1 minute ago
                currentTime
            )
            
            // If we can get stats, we have permission
            val hasPermission = stats != null && stats.isNotEmpty()
            promise.resolve(hasPermission)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Request Usage Stats permission by opening settings
     */
    @ReactMethod
    fun requestUsageStatsPermission() {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } catch (e: Exception) {
            // Handle error - maybe show a toast or send event to RN
            sendEvent("usageStatsError", "Failed to open settings: ${e.message}")
        }
    }

    /**
     * Set development mode (for testing with shorter intervals)
     */
    @ReactMethod
    fun setDevelopmentMode(enabled: Boolean, thresholdSeconds: Int = 5) {
        isDevelopmentMode = enabled
        devBlockThresholdSeconds = thresholdSeconds
        if (enabled) {
            devSessionStartTime = System.currentTimeMillis()
        }
    }

    /**
     * Set the blocking threshold in minutes
     */
    @ReactMethod
    fun setBlockThreshold(minutes: Int) {
        blockThresholdMinutes = minutes
    }

    /**
     * Get current app usage for today
     */
    @ReactMethod
    fun getCurrentUsage(promise: Promise) {
        try {
            if (isDevelopmentMode) {
                // Development mode: use simple timer
                val currentTime = System.currentTimeMillis()
                val usageSeconds = if (devSessionStartTime > 0) {
                    (currentTime - devSessionStartTime) / 1000
                } else {
                    0L
                }
                
                val result = Arguments.createMap().apply {
                    putDouble("usageMinutes", (usageSeconds / 60.0))
                    putDouble("usageSeconds", usageSeconds.toDouble())
                    putDouble("thresholdMinutes", (devBlockThresholdSeconds / 60.0))
                    putDouble("thresholdSeconds", devBlockThresholdSeconds.toDouble())
                    putBoolean("shouldBlock", usageSeconds >= devBlockThresholdSeconds)
                    putBoolean("isDevelopmentMode", true)
                }
                
                promise.resolve(result)
                return
            }
            
            // Production mode: use actual usage stats
            val packageName = context.packageName
            val currentTime = System.currentTimeMillis()
            val startOfDay = getStartOfDay()
            
            val stats = usageStatsManager?.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startOfDay,
                currentTime
            )
            
            var totalUsageTime = 0L
            stats?.forEach { usageStats ->
                if (usageStats.packageName == packageName) {
                    totalUsageTime += usageStats.totalTimeInForeground
                }
            }
            
            val usageMinutes = totalUsageTime / (1000 * 60) // Convert to minutes
            
            val result = Arguments.createMap().apply {
                putDouble("usageMinutes", usageMinutes.toDouble())
                putDouble("usageSeconds", (totalUsageTime / 1000).toDouble())
                putDouble("thresholdMinutes", blockThresholdMinutes.toDouble())
                putDouble("thresholdSeconds", (blockThresholdMinutes * 60).toDouble())
                putBoolean("shouldBlock", usageMinutes >= blockThresholdMinutes)
                putBoolean("isDevelopmentMode", false)
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("USAGE_ERROR", "Failed to get usage stats: ${e.message}")
        }
    }

    /**
     * Start monitoring usage - call this periodically
     */
    @ReactMethod
    fun startUsageMonitoring() {
        // This would typically be called from a background service
        // For now, we'll just check when requested
        checkUsageAndNotify()
    }

    /**
     * Check usage and send event to React Native if blocking is needed
     */
    private fun checkUsageAndNotify() {
        try {
            if (isDevelopmentMode) {
                // Development mode: simple timer check
                val currentTime = System.currentTimeMillis()
                val usageSeconds = if (devSessionStartTime > 0) {
                    (currentTime - devSessionStartTime) / 1000
                } else {
                    0L
                }
                
                if (usageSeconds >= devBlockThresholdSeconds) {
                    val params = Arguments.createMap().apply {
                        putDouble("usageSeconds", usageSeconds.toDouble())
                        putDouble("thresholdSeconds", devBlockThresholdSeconds.toDouble())
                        putString("message", "Development mode: Time to learn a new word!")
                        putBoolean("isDevelopmentMode", true)
                    }
                    sendEvent("shouldShowBlockScreen", params)
                }
                return
            }
            
            // Production mode: actual usage stats
            val packageName = context.packageName
            val currentTime = System.currentTimeMillis()
            val startOfDay = getStartOfDay()
            
            val stats = usageStatsManager?.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startOfDay,
                currentTime
            )
            
            var totalUsageTime = 0L
            stats?.forEach { usageStats ->
                if (usageStats.packageName == packageName) {
                    totalUsageTime += usageStats.totalTimeInForeground
                }
            }
            
            val usageMinutes = totalUsageTime / (1000 * 60)
            
            if (usageMinutes >= blockThresholdMinutes) {
                // Send event to React Native to show blocking screen
                val params = Arguments.createMap().apply {
                    putDouble("usageMinutes", usageMinutes.toDouble())
                    putDouble("thresholdMinutes", blockThresholdMinutes.toDouble())
                    putString("message", "Time to learn a new word!")
                    putBoolean("isDevelopmentMode", false)
                }
                sendEvent("shouldShowBlockScreen", params)
            }
        } catch (e: Exception) {
            sendEvent("usageStatsError", "Monitoring error: ${e.message}")
        }
    }

    /**
     * Reset usage tracking (called after learning session)
     */
    @ReactMethod
    fun resetUsageTracking() {
        lastCheckTime = System.currentTimeMillis()
        if (isDevelopmentMode) {
            devSessionStartTime = System.currentTimeMillis() // Reset development timer
        }
        // You might want to store this in SharedPreferences for persistence
    }

    /**
     * Get usage statistics for the stats screen
     */
    @ReactMethod
    fun getUsageStatistics(promise: Promise) {
        try {
            val currentTime = System.currentTimeMillis()
            val weekAgo = currentTime - (7 * 24 * 60 * 60 * 1000L)
            
            val stats = usageStatsManager?.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                weekAgo,
                currentTime
            )
            
            var totalBlocks = 0
            var totalLearningTime = 0L
            
            // This is simplified - you'd want to store actual block events in a database
            stats?.forEach { usageStats ->
                if (usageStats.packageName == context.packageName) {
                    val dailyMinutes = usageStats.totalTimeInForeground / (1000 * 60)
                    totalBlocks += (dailyMinutes / blockThresholdMinutes).toInt()
                }
            }
            
            val result = Arguments.createMap().apply {
                putInt("totalBlocks", totalBlocks)
                putDouble("totalLearningTime", totalLearningTime.toDouble())
                putDouble("averageSessionTime", if (totalBlocks > 0) totalLearningTime.toDouble() / totalBlocks else 0.0)
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("STATS_ERROR", "Failed to get statistics: ${e.message}")
        }
    }

    /**
     * Send event to React Native
     */
    private fun sendEvent(eventName: String, params: Any) {
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    /**
     * Get start of current day in milliseconds
     */
    private fun getStartOfDay(): Long {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    /**
     * Constants for React Native
     */
    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf(
            "INTERVAL_15_MIN" to 15,
            "INTERVAL_20_MIN" to 20,
            "INTERVAL_30_MIN" to 30,
            "INTERVAL_60_MIN" to 60,
            "INTERVAL_1_DAY" to (24 * 60)
        )
    }
}