# Testing React Native App on Your Tecno Phone

## ✅ Current Status
- ✅ Java 25 - Installed and working
- ✅ Android Studio - Installed
- ❌ Android SDK PATH - Needs configuration
- ⏳ Tecno Phone - Ready to connect

## Step 1: Set Up Android SDK Environment Variables

### Find Your Android SDK Path
The Android SDK is usually located at:
```
C:\Users\ldlwa\AppData\Local\Android\Sdk
```

### Add Environment Variables

1. **Open System Properties:**
   - Press `Win + R`
   - Type `sysdm.cpl`
   - Press Enter

2. **Click "Environment Variables"**

3. **Add ANDROID_HOME (System Variables):**
   - Click "New" under System Variables
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\ldlwa\AppData\Local\Android\Sdk`
   - Click OK

4. **Update PATH (System Variables):**
   - Find "Path" in System Variables
   - Click "Edit"
   - Click "New" and add these three paths:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`
     - `%ANDROID_HOME%\tools\bin`
   - Click OK on all windows

5. **Restart your Command Prompt** (close and reopen)

## Step 2: Enable USB Debugging on Your Tecno Phone

### Enable Developer Options:
1. Go to **Settings**
2. Go to **About Phone** (or System > About Phone)
3. Find **Build Number**
4. **Tap Build Number 7 times** repeatedly
5. You'll see "You are now a developer!"

### Enable USB Debugging:
1. Go back to **Settings**
2. Look for **Developer Options** (might be under System or Additional Settings)
3. Turn on **Developer Options**
4. Scroll down and enable **USB Debugging**
5. Enable **Install via USB** (if available)

## Step 3: Connect Your Tecno Phone

1. **Connect your Tecno phone** to PC with USB cable
2. On your phone, you'll see a popup asking to **"Allow USB Debugging?"**
3. Check **"Always allow from this computer"**
4. Tap **"OK"**

## Step 4: Verify Connection

After setting up environment variables and restarting Command Prompt:

```cmd
adb devices
```

You should see your Tecno phone listed like:
```
List of devices attached
ABC123456789    device
```

## Step 5: Install React Native Dependencies

```cmd
npm install
```

This will install all the React Native packages needed for your app.

## Step 6: Run Your App on Tecno Phone

### Option A: Run with React Native CLI (Recommended)
```cmd
npx react-native run-android
```

This will:
- Build the app
- Install it on your Tecno phone
- Start the Metro bundler
- Launch the app automatically

### Option B: Build APK to Install Manually
If you want to build an APK file to install:

```cmd
cd android
gradlew assembleDebug
```

The APK will be at:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

Transfer this to your phone and install it.

## Troubleshooting

### If "adb devices" shows no devices:
1. Make sure USB Debugging is enabled
2. Try a different USB cable (some cables are charge-only)
3. Change USB mode on phone to "File Transfer" or "MTP"
4. Restart ADB: `adb kill-server` then `adb start-server`

### If build fails:
1. Make sure you have internet connection (downloads dependencies)
2. Check that ANDROID_HOME is set correctly
3. Make sure Android Studio SDK is fully installed
4. Try: `cd android && gradlew clean` then try again

### If app crashes on phone:
1. Check Metro bundler is running
2. Shake phone and enable "Hot Reload"
3. Check console for errors

## Quick Start Commands (After Setup)

1. **First time setup:**
```cmd
npm install
```

2. **Run on phone:**
```cmd
npx react-native run-android
```

3. **If Metro bundler stops:**
```cmd
npx react-native start
```

4. **Check if phone is connected:**
```cmd
adb devices
```

## Expected Result

Once running, you'll see your Health Tracker app on your Tecno phone with:
- ✅ Bottom tab navigation
- ✅ Dashboard with health metrics
- ✅ Heart rate, steps, medicine tracking
- ✅ Milestones and rewards
- ✅ Settings page
- ✅ Native Android UI and performance

Let me know once you've set up the environment variables and I'll help you run the app!
