package com.wordblockrn

import android.graphics.Color
import android.os.Bundle
import android.os.CountDownTimer
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class BlockingActivity : AppCompatActivity() {
    
    private lateinit var blockedPackage: String
    private lateinit var countdownTimer: CountDownTimer
    private lateinit var unblockButton: Button
    private lateinit var countdownText: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Make this activity fullscreen and prevent back button
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED)
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD)
        
        blockedPackage = intent.getStringExtra("blocked_package") ?: ""
        
        createUI()
        setupCountdown()
    }
    
    private fun createUI() {
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        layout.gravity = Gravity.CENTER
        layout.setBackgroundColor(Color.parseColor("#f44336"))
        layout.setPadding(64, 64, 64, 64)
        
        val title = TextView(this)
        title.text = "App Blocked!"
        title.textSize = 28f
        title.setTextColor(Color.WHITE)
        title.gravity = Gravity.CENTER
        
        val message = TextView(this)
        val appName = getAppDisplayName(blockedPackage)
        message.text = "You've reached your time limit for $appName"
        message.textSize = 18f
        message.setTextColor(Color.WHITE)
        message.gravity = Gravity.CENTER
        
        countdownText = TextView(this)
        countdownText.text = "Wait 10 seconds to unblock"
        countdownText.textSize = 20f
        countdownText.setTextColor(Color.WHITE)
        countdownText.gravity = Gravity.CENTER
        
        unblockButton = Button(this)
        unblockButton.text = "Unblock App"
        unblockButton.textSize = 16f
        unblockButton.isEnabled = false
        unblockButton.setOnClickListener { 
            unblockApp()
        }
        
        // Add margins
        val titleParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        titleParams.setMargins(0, 0, 0, 40)
        title.layoutParams = titleParams
        
        val messageParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        messageParams.setMargins(0, 0, 0, 60)
        message.layoutParams = messageParams
        
        val countdownParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        countdownParams.setMargins(0, 0, 0, 60)
        countdownText.layoutParams = countdownParams
        
        layout.addView(title)
        layout.addView(message)
        layout.addView(countdownText)
        layout.addView(unblockButton)
        
        setContentView(layout)
    }
    
    private fun setupCountdown() {
        countdownTimer = object : CountDownTimer(10000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val seconds = millisUntilFinished / 1000
                countdownText.text = "Wait $seconds seconds to unblock"
            }
            
            override fun onFinish() {
                countdownText.text = "You can now unblock the app"
                unblockButton.isEnabled = true
            }
        }
        countdownTimer.start()
    }
    
    private fun unblockApp() {
        // Send broadcast to notify unblock
        val intent = android.content.Intent("com.wordblockrn.UNBLOCK_APP").apply {
            putExtra("package_name", blockedPackage)
        }
        sendBroadcast(intent)
        
        finish()
    }
    
    private fun getAppDisplayName(packageName: String): String {
        return try {
            val packageManager = packageManager
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            packageName
        }
    }
    
    override fun onBackPressed() {
        // Prevent going back
    }
    
    override fun onDestroy() {
        super.onDestroy()
        if (::countdownTimer.isInitialized) {
            countdownTimer.cancel()
        }
    }
}