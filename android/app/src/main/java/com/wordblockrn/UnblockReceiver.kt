package com.wordblockrn

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.facebook.react.ReactApplication
import com.facebook.react.modules.core.DeviceEventManagerModule

class UnblockReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "com.wordblockrn.UNBLOCK_APP") {
            val packageName = intent.getStringExtra("package_name")
            packageName?.let {
                sendUnblockEvent(context, it)
            }
        }
    }
    
    private fun sendUnblockEvent(context: Context, packageName: String) {
        try {
            val reactApplication = context.applicationContext as? ReactApplication
            val reactContext = reactApplication?.reactNativeHost?.reactInstanceManager?.currentReactContext
            
            reactContext?.let { ctx ->
                val eventParams = com.facebook.react.bridge.WritableNativeMap().apply {
                    putString("packageName", packageName)
                    putDouble("timestamp", System.currentTimeMillis().toDouble())
                }
                
                ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onAppUnblocked", eventParams)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}