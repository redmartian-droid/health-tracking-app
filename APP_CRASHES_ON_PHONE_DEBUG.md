# 🔍 App Crashes Immediately - Debugging Guide

## Issue: App Exits Immediately on Phone

This is common with React Native debug builds! Here's why and how to fix it:

## Why It's Crashing:

**Debug APKs** try to connect to a development server (Metro bundler) running on your computer. When it can't find the server, the app crashes.

## Solution Options:

### Option 1: Build a Release APK (Recommended - Standalone)

A release APK has the JavaScript bundle embedded and doesn't need a dev server.

**In Command Prompt, run:**
```cmd
cd android && gradlew.bat assembleRelease && cd ..
```

**Your release APK will be at:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**Pros:**
- Works standalone
- Smaller file size
- No dev server needed
- What you'd use for production

### Option 2: Run Metro Server (For Development/Debugging)

Keep the debug APK but run the Metro server on your PC.

**Steps:**
1. Make sure your phone and PC are on the same WiFi network
2. In Command Prompt, run:
   ```cmd
   npm start
   ```
3. Wait for Metro to start
4. On your phone, open the app
5. Shake the phone to open dev menu
6. Tap "Settings"
7. Tap "Debug server host & port for device"
8. Enter your PC's IP address:8081 (e.g., `192.168.1.100:8081`)
9. Restart the app

**To find your PC's IP:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter

### Option 3: Check for Other Errors

If neither works, we need to see the error logs.

**On your phone:**
1. Connect phone to PC via USB
2. Enable USB Debugging in phone settings
3. In Command Prompt, run:
   ```cmd
   adb logcat | findstr "ReactNative"
   ```
4. Try opening the app
5. Copy the error messages and show me

## Recommendation:

**Try Option 1 first** (build release APK). It's the simplest and what you'd want for actual use.

---
**Next Step:** Choose one of the options above and let me know the result!
