# Quick Start Guide: ESP32-S3 Watch + Expo App BLE Connection

**Fast track guide to get your Waveshare ESP32-S3 smartwatch connected to your Health Tracking app.**

---

## ⚡ 5-Minute Setup

### Part A: Program ESP32 Watch (5 minutes)

1. **Install Arduino IDE**
   - Download: https://www.arduino.cc/en/software

2. **Add ESP32 Support**
   - File → Preferences → Additional Board Manager URLs
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Tools → Board → Boards Manager → Search "ESP32" → Install

3. **Upload Firmware**
   - Open: `esp32-c3-mini/ESP32_S3_HealthWatch_BLE.ino`
   - Tools → Board → "ESP32S3 Dev Module"
   - Tools → Port → Select your COM port
   - Click Upload (→)

4. **Verify**
   - Tools → Serial Monitor (115200 baud)
   - Should see: "✅ BLE initialized and advertising"

### Part B: Build Mobile App (10 minutes)

1. **Open Terminal in Project Folder**
   ```bash
   cd "C:\Users\Vuyo\Downloads\Prototype2 (2)\Prototype2\portfolio-proff\health-tracking-app"
   ```

2. **Create Development Build**
   ```bash
   npx expo prebuild
   npx expo run:android
   ```

3. **Grant Permissions**
   - When app opens, allow Bluetooth
   - Allow Location (required on Android)

4. **Connect Watch**
   - Tap Settings (bottom nav)
   - Tap "Connect Watch"
   - Select "Chronos C3"
   - Done! ✅

---

## 📁 File Structure

```
health-tracking-app/
├── EXPO_BLE_BUILD_GUIDE.md       ← Full Expo build instructions
├── ESP32_BLE_INTEGRATION.md      ← Complete BLE protocol docs
├── BLE_QUICKSTART.md             ← Original quickstart
├── QUICK_START_BLE.md            ← This file
└── src/
    └── services/
        └── bleService.js         ← BLE communication logic

esp32-c3-mini/
├── ESP32_S3_HealthWatch_BLE.ino  ← ESP32 firmware
└── ESP32_SETUP_GUIDE.md          ← Detailed ESP32 instructions
```

---

## 🎯 What You Get

**ESP32 Watch Features:**
- ✅ BLE advertising as "Chronos C3"
- ✅ Sends steps count every 5 seconds
- ✅ Sends heart rate (simulated: 60-100 BPM)
- ✅ Sends battery level (0-100%)
- ✅ Receives time sync from app
- ✅ Receives weather data
- ✅ Receives notifications
- ✅ Auto-reconnect on disconnect

**Mobile App Features:**
- ✅ Automatic BLE scanning
- ✅ One-tap connection
- ✅ Real-time data updates
- ✅ Auto-reconnection (5 attempts)
- ✅ Connection status indicator
- ✅ Data caching (30 seconds)
- ✅ Graceful fallback to mock data

---

## 🔧 Troubleshooting Quick Fixes

### ESP32 Issues

**Problem:** Upload fails
```
Solution: Hold BOOT button → Click Upload → Release BOOT after "Connecting..."
```

**Problem:** No serial output
```
Solution: Check baud rate is 115200 → Press RESET button on ESP32
```

**Problem:** Not advertising
```
Solution: Check Serial Monitor for errors → Re-upload firmware
```

### App Issues

**Problem:** "BLE not available"
```
Solution: You're in Expo Go - must build with: npx expo prebuild
```

**Problem:** Watch not found
```
Solution: 
1. Check ESP32 Serial Monitor shows "advertising"
2. Use BLE scanner app (nRF Connect) to verify
3. Reduce distance between devices
4. Restart both devices
```

**Problem:** Connection drops
```
Solution:
1. Keep devices close (< 10 meters)
2. Away from WiFi interference
3. Check battery levels
```

---

## 📱 Testing Connection

### Use BLE Scanner App

**Android:** Install "nRF Connect"
**iOS:** Install "LightBlue Explorer"

1. Open scanner app
2. Scan for devices
3. Look for "Chronos C3"
4. Should show Nordic UART Service (6E40...)

If you see it in scanner but not in app:
- Check app permissions
- Restart app
- Check console logs

---

## 🎨 Customization

### Change Watch Name

In `ESP32_S3_HealthWatch_BLE.ino` line 31:
```cpp
#define DEVICE_NAME "Chronos C3"  // Change to "MyWatch"
```

### Change Update Frequency

In `ESP32_S3_HealthWatch_BLE.ino` line 42:
```cpp
#define DATA_SEND_INTERVAL 5000  // 5 seconds → change to 3000 for 3 seconds
```

### Add Real Sensors

The firmware includes TODO comments for:
- QMI8658C IMU (step counting)
- Heart rate sensor
- Battery voltage reading

Uncomment and implement the sensor-specific code.

---

## 📊 Data Protocol

Every packet is 3 bytes:
```
[Type][Value Low][Value High]
```

### From Watch to App:
- `0x01` = Steps
- `0x02` = Heart Rate
- `0x03` = Battery

### From App to Watch:
- `0x04` = Time Sync
- `0x05` = Weather
- `0x06` = Notification

**Example:** Steps = 5000
```
[0x01][0x88][0x13]
 Type  Low   High
```

---

## 🚀 Next Steps

### For Development:

1. **Add Real Sensors**
   - Implement IMU for step counting
   - Add heart rate sensor
   - Read actual battery voltage

2. **Customize UI**
   - Modify `src/components/SettingsPage.js`
   - Add watch-specific features
   - Create custom dashboard

3. **Add Features**
   - Notifications from phone to watch
   - Weather display on watch
   - Custom watch faces

### For Production:

1. **Build Release APK**
   ```bash
   eas build --platform android --profile production
   ```

2. **Optimize Battery**
   - Reduce transmission frequency
   - Implement sleep modes
   - Optimize BLE parameters

3. **Add Analytics**
   - Track connection success rate
   - Monitor battery usage
   - Log data transfer stats

---

## 📞 Need Help?

### Check These First:
1. **ESP32 Serial Monitor** - See what's happening on watch
2. **App Console Logs** - Check for JavaScript errors
3. **BLE Scanner App** - Verify watch is advertising
4. **This Guide** - Most issues covered above

### Documentation:
- **Detailed ESP32 Setup:** `esp32-c3-mini/ESP32_SETUP_GUIDE.md`
- **Full BLE Protocol:** `ESP32_BLE_INTEGRATION.md`
- **Expo Build Guide:** `EXPO_BLE_BUILD_GUIDE.md`

---

## ✅ Checklist

**Before Starting:**
- [ ] USB cable connected to ESP32
- [ ] Android phone/emulator ready
- [ ] Arduino IDE installed
- [ ] Node.js installed

**ESP32 Setup:**
- [ ] Firmware uploaded
- [ ] Serial monitor shows initialization
- [ ] "BLE initialized and advertising" message
- [ ] Visible in BLE scanner app

**App Setup:**
- [ ] Development build created (`npx expo prebuild`)
- [ ] App running on device (`npx expo run:android`)
- [ ] Permissions granted (Bluetooth, Location)
- [ ] App opens successfully

**Connection:**
- [ ] Settings → ESP32 Smartwatch section
- [ ] "Connect Watch" button visible
- [ ] Can scan for devices
- [ ] "Chronos C3" found
- [ ] Connection established ✅
- [ ] Data updates in app ✅
- [ ] Serial monitor shows "Device connected!" ✅

---

## 🎉 Success!

**You now have:**
- ✅ ESP32-S3 smartwatch with BLE
- ✅ Mobile app with live data
- ✅ Two-way communication
- ✅ Real-time health tracking

**Start tracking:**
- Steps
- Heart rate
- Battery level
- And more!

---

**Version:** 1.0.0  
**Last Updated:** November 9, 2025  
**Hardware:** Waveshare ESP32-S3-Touch-LCD-1.69  
**Software:** React Native + Expo + BLE
