# Expo Development Build Guide for BLE

This guide walks you through creating a custom Expo development build to enable Bluetooth Low Energy (BLE) functionality.

**Important:** BLE **cannot work in Expo Go**. You must create a custom development build.

---

## 📋 Prerequisites

### Required Software
- ✅ Node.js (v18 or later)
- ✅ npm or yarn
- ✅ Android Studio (for Android builds)
- ✅ Xcode (for iOS builds - Mac only)

### For Android Builds
- ✅ Android Studio installed
- ✅ Android SDK Platform 33 or higher
- ✅ Android device or emulator (Android 6.0+)
- ✅ USB debugging enabled on physical device

### For iOS Builds (Mac only)
- ✅ Xcode installed
- ✅ CocoaPods installed: `sudo gem install cocoapods`
- ✅ iOS device or simulator (iOS 11+)
- ✅ Apple Developer account (for physical device testing)

---

## 🚀 Quick Start

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one at: https://expo.dev/signup

### Step 3: Navigate to Project

```bash
cd "C:\Users\Vuyo\Downloads\Prototype2 (2)\Prototype2\portfolio-proff\health-tracking-app"
```

---

## 🏗️ Method 1: Local Development Build (Recommended)

This method builds the app locally on your machine - **fastest for development**.

### For Android:

1. **Generate Native Project Files**
   ```bash
   npx expo prebuild --platform android
   ```

2. **Run on Android Device/Emulator**
   ```bash
   npx expo run:android
   ```

   This will:
   - Build the app
   - Install on connected device/emulator
   - Start the development server
   - Enable hot reloading

3. **Connect Your Watch**
   Once the app opens:
   - Go to Settings tab
   - Tap "Connect Watch"
   - Select "Chronos C3"

### For iOS (Mac only):

1. **Generate Native Project Files**
   ```bash
   npx expo prebuild --platform ios
   ```

2. **Install Dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Run on iOS Device/Simulator**
   ```bash
   npx expo run:ios
   ```

---

## 🌐 Method 2: EAS Build (Cloud Build)

Use this if local builds don't work or you want to share the app.

### Step 1: Configure EAS

```bash
eas build:configure
```

This creates `eas.json` configuration file.

### Step 2: Build for Android

**Development Build:**
```bash
eas build --platform android --profile development
```

**Preview Build (APK for sharing):**
```bash
eas build --platform android --profile preview
```

**Production Build:**
```bash
eas build --platform android --profile production
```

### Step 3: Install on Device

After build completes:
1. Download APK from the EAS link
2. Transfer to Android device
3. Install (enable "Install from Unknown Sources")
4. Open app

---

## 📱 Testing BLE Connection

### Before Testing

1. **Upload ESP32 Firmware**
   - Follow `ESP32_SETUP_GUIDE.md` in the esp32-c3-mini folder
   - Verify ESP32 is advertising as "Chronos C3"

2. **Enable Bluetooth**
   - Turn on Bluetooth on your phone
   - Grant location permissions (required for BLE on Android)

### Testing Steps

1. **Launch App**
   - Open the Health Tracking app
   - Wait for splash screen

2. **Go to Settings**
   - Tap the Settings icon (bottom navigation)
   - Scroll to "ESP32 Smartwatch" section

3. **Connect Watch**
   - Tap "Connect Watch" button
   - App will scan for "Chronos C3"
   - Wait 5-10 seconds

4. **Verify Connection**
   - Status should change to "Connected"
   - Check ESP32 Serial Monitor shows "Device connected!"
   - Watch Dashboard for live data updates

5. **Check Data Flow**
   - Steps should update every 5 seconds
   - Heart rate should update
   - Battery level should display

---

## 🔧 Troubleshooting

### "Module not found: react-native-ble-plx"

Already installed, but if needed:
```bash
npm install react-native-ble-plx react-native-permissions
npx expo prebuild --clean
```

### "Permissions not working"

**Android:**
1. Go to Settings → Apps → Health Tracker
2. Enable Location permission
3. Enable Bluetooth permission (Android 12+)
4. Restart app

**iOS:**
1. Settings → Health Tracker
2. Enable Bluetooth permission
3. Restart app

### "Build failing with gradle errors"

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npx expo run:android
```

### "BLE not scanning"

Verify in code that BLE is initialized:
```javascript
// In your app, check console logs
console.log('BLE Available:', bleService.isBLEAvailable);
```

If false, you're in Expo Go - must use development build.

### "Device not found"

1. Check ESP32 is powered on
2. Verify ESP32 Serial Monitor shows "advertising"
3. Use BLE scanner app to confirm device is visible
4. Reduce distance between phone and watch
5. Restart both devices

### "Connection drops frequently"

1. Ensure phone and watch are close
2. Check battery level on both devices
3. Disable battery optimization for app
4. Reduce BLE interference (move away from WiFi routers)

---

## 🎯 Development Workflow

### Recommended Flow:

1. **Initial Setup** (once)
   ```bash
   npx expo prebuild
   ```

2. **Daily Development**
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

3. **After Installing New Native Packages**
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```

4. **For JavaScript Changes Only**
   - Just save the file
   - Hot reload will update app automatically
   - No rebuild needed!

---

## 📦 Building for Production

### Android APK:

```bash
eas build --platform android --profile production
```

### iOS IPA:

```bash
eas build --platform ios --profile production
```

### Play Store / App Store:

Follow Expo's submission guides:
- Android: https://docs.expo.dev/submit/android/
- iOS: https://docs.expo.dev/submit/ios/

---

## 🔍 Debugging

### Enable Verbose BLE Logging:

In `src/services/bleService.js`, add:
```javascript
if (this.manager) {
  this.manager.setLogLevel('Verbose');
}
```

### Check BLE State:

```javascript
import bleService from './src/services/bleService';

const checkBLE = async () => {
  const state = await bleService.manager.state();
  console.log('BLE State:', state);
};
```

### Monitor BLE Events:

```javascript
bleService.addEventListener('onConnectionChange', (connected) => {
  console.log('Connection changed:', connected);
});

bleService.addEventListener('onDataReceived', (data) => {
  console.log('Data received:', data);
});

bleService.addEventListener('onError', (error) => {
  console.error('BLE Error:', error);
});
```

---

## 📊 Performance Tips

### Battery Optimization

1. **Reduce scan frequency**
   - Don't scan continuously
   - Use targeted scans with timeout

2. **Optimize data transmission**
   - Currently sends every 5 seconds
   - Adjust `DATA_SEND_INTERVAL` in ESP32 firmware if needed

3. **Background handling**
   - App handles disconnection gracefully
   - Auto-reconnect on connection loss

---

## 🆘 Common Issues

### Issue: "Expo Go doesn't support BLE"
✅ **Solution:** Use development build (this guide)

### Issue: "Build takes too long"
✅ **Solution:** Use local builds instead of EAS

### Issue: "Out of memory during build"
✅ **Solution:** 
```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=4096
npx expo run:android
```

### Issue: "Can't connect to physical device"
✅ **Solution:**
- Enable USB debugging
- Install ADB drivers
- Accept RSA fingerprint prompt

---

## ✅ Success Checklist

**Expo App:**
- [ ] Development build created
- [ ] App installed on device
- [ ] Bluetooth permissions granted
- [ ] Location permissions granted (Android)
- [ ] App launches successfully
- [ ] BLE service initializes

**ESP32 Watch:**
- [ ] Firmware uploaded
- [ ] BLE advertising active
- [ ] Serial monitor shows status
- [ ] Visible in BLE scanner apps

**Connection:**
- [ ] App can scan for devices
- [ ] "Chronos C3" appears in scan
- [ ] Connection established
- [ ] Data updates in app
- [ ] ESP32 shows "Device connected!"

---

## 📚 Additional Resources

### Expo Documentation
- Development Builds: https://docs.expo.dev/develop/development-builds/introduction/
- BLE: https://docs.expo.dev/versions/latest/sdk/bluetooth/
- Prebuild: https://docs.expo.dev/workflow/prebuild/

### React Native BLE
- react-native-ble-plx: https://github.com/dotintent/react-native-ble-plx
- API Reference: https://dotintent.github.io/react-native-ble-plx/

### Android Development
- ADB Setup: https://developer.android.com/studio/command-line/adb
- USB Debugging: https://developer.android.com/studio/debug/dev-options

---

## 🎉 You're Ready!

Once your development build is running and ESP32 is programmed:

1. Open the app
2. Go to Settings
3. Tap "Connect Watch"
4. Start tracking your health data!

For any issues, check:
- Serial Monitor on ESP32
- App console logs
- BLE scanner apps
- This troubleshooting guide

**Next Steps:**
- Customize ESP32 firmware for your sensors
- Add custom UI in the mobile app
- Implement additional BLE features

---

**Last Updated**: November 9, 2025
**Version**: 1.0.0
