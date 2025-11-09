# Building a Custom Expo Development Build for BLE

## ⚠️ Important Notice

**The BLE integration requires a custom development build and CANNOT work with Expo Go.**

This is because `react-native-ble-plx` uses native Bluetooth modules that aren't included in the Expo Go app.

---

## What You Need to Know

### Option 1: Use Mock Data (Current State)
- ✅ Works right now in Expo Go
- ✅ No additional setup needed
- ❌ Cannot connect to real ESP32 watch
- ❌ Uses random mock data

### Option 2: Build Custom Development Build (For Real BLE)
- ✅ Connect to real ESP32 watch
- ✅ Real-time data from sensors
- ❌ Requires additional setup (15-30 minutes)
- ❌ Requires Android Studio or Xcode
- ❌ Larger app size

---

## How to Create a Custom Development Build

### Prerequisites

**For Android:**
- Android Studio installed
- Android SDK configured
- Physical Android device or emulator

**For iOS:**
- macOS computer
- Xcode installed
- Apple Developer account ($99/year for device testing)
- Physical iOS device or simulator

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account:
```bash
eas register
```

### Step 3: Configure the Project

```bash
eas build:configure
```

This creates an `eas.json` file in your project.

### Step 4: Generate Native Projects (Prebuild)

```bash
npx expo prebuild
```

This generates the `android/` and `ios/` folders with native code.

**What happens:**
- Creates `android/` folder with Android project
- Creates `ios/` folder with iOS project
- Installs native dependencies including BLE
- Configures permissions automatically

### Step 5: Build for Android (Easiest Option)

#### Option A: Build Locally (Faster, No Cloud Build)

```bash
# Make sure Android Studio is installed first
npx expo run:android
```

This will:
1. Build the app with BLE support
2. Install it on connected device/emulator
3. Start the dev server
4. Launch the app automatically

#### Option B: Build in Cloud (EAS Build)

```bash
# Development build (includes dev tools)
eas build --profile development --platform android

# This takes 10-20 minutes
# You'll get a URL to download the APK
```

Then install the APK on your Android device.

### Step 6: Build for iOS

```bash
# For simulator
npx expo run:ios

# OR for device (requires Apple Developer account)
eas build --profile development --platform ios
```

---

## Quick Start (Recommended for Testing)

**Fastest way to test BLE on Android:**

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Generate native projects
npx expo prebuild

# 3. Run on Android
npx expo run:android
```

**Time required:** 5-10 minutes (first time)

---

## After Building

Once you have a custom build:

1. **Open the app** (it's installed on your device)
2. **Navigate to Settings** tab
3. **Tap "Connect Watch"** button
4. **Grant Bluetooth permissions** when prompted
5. **Watch will scan for** "Chronos C3"
6. **Connection established!** 🎉

---

## Troubleshooting Custom Builds

### "Android SDK not found"

**Solution:**
1. Install Android Studio
2. Open Android Studio
3. Go to Settings → Android SDK
4. Note the SDK path
5. Set environment variable:
   ```bash
   # Windows
   set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
   
   # Mac/Linux
   export ANDROID_HOME=$HOME/Library/Android/sdk
   ```

### "Gradle build failed"

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### "No devices found"

**Solution:**
1. Enable USB Debugging on Android phone
2. Connect via USB
3. Run: `adb devices` to verify
4. Try again

### "Command failed: ./gradlew"

**Solution:**
```bash
# Give execute permission (Mac/Linux)
chmod +x android/gradlew
```

---

## File Size Comparison

| Build Type | Size | BLE Support |
|------------|------|-------------|
| Expo Go | ~200 MB | ❌ No |
| Custom Build | ~50-100 MB | ✅ Yes |
| Production Build | ~15-30 MB | ✅ Yes |

---

## Development Workflow

### With Expo Go (Current)
```
npm start → Scan QR → App loads → Limited features
```

### With Custom Build
```
npx expo prebuild (once)
npx expo run:android → App installs → Full features including BLE
```

After the initial build, you can still use hot reload:
```bash
npm start
# App automatically reloads on file changes
```

---

## Alternative: Use Expo Dev Client

If you want the best of both worlds:

```bash
# 1. Install dev client
npx expo install expo-dev-client

# 2. Build once
eas build --profile development --platform android

# 3. Install the build on your device

# 4. Use it like Expo Go but with BLE support
npm start
# Scan QR with your custom development app
```

---

## For Production Release

When ready to release:

```bash
# Android APK
eas build --profile production --platform android

# iOS App
eas build --profile production --platform ios

# Both
eas build --profile production --platform all
```

---

## Cost Breakdown

| Item | Cost | Required For |
|------|------|--------------|
| Expo Account (Free) | $0 | Development |
| EAS Build (Free Tier) | $0 | 30 builds/month |
| Android Development | $0 | Testing on Android |
| iOS Development | $0 | Simulator only |
| iOS Device Testing | $99/year | Real iPhone testing |
| iOS App Store | $99/year | Publishing to App Store |
| Android Play Store | $25 one-time | Publishing to Play Store |

**For testing BLE on Android: $0** 🎉

---

## Recommended Next Steps

### If you want to test BLE now:

1. **Run these commands:**
   ```bash
   npm install
   npx expo prebuild
   npx expo run:android
   ```

2. **Upload ESP32 code** (from BLE_QUICKSTART.md)

3. **Test the connection!**

### If you want to keep using Expo Go:

- The app will continue to work with mock data
- BLE features will show an info message
- No watch connection, but all other features work

---

## Summary

| Feature | Expo Go | Custom Build |
|---------|---------|--------------|
| **Quick to test** | ✅ Yes (30 seconds) | ⚠️ Slower (5-10 min first time) |
| **BLE Support** | ❌ No | ✅ Yes |
| **Hot Reload** | ✅ Yes | ✅ Yes |
| **Native Modules** | ❌ Limited | ✅ All |
| **File Size** | 200+ MB (Expo Go) | 50-100 MB |
| **Setup Required** | None | Android Studio or Xcode |

---

## Need Help?

1. Check Expo documentation: https://docs.expo.dev/develop/development-builds/create-a-build/
2. Android Studio: https://developer.android.com/studio
3. EAS Build: https://docs.expo.dev/build/setup/

---

**The current app works fine in Expo Go, but won't connect to your ESP32 watch. To use the real BLE features, follow this guide to create a custom build!** 📱🔵

---

**Last Updated**: November 6, 2025
