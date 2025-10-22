# 🚀 Quick Start: Build APK for Tecno Spark 40C

## Ready to Build? Follow These 3 Simple Steps!

### ✅ Your System is Ready!
- ✅ Android SDK configured at: `C:\Users\ldlwa\AppData\Local\Android\Sdk`
- ✅ Project structure verified
- ✅ Build configuration ready

---

## 📱 OPTION 1: Build APK (Recommended for First Time)

### Step 1: Open Command Prompt in Project Folder
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to your project:
```cmd
cd C:\Users\ldlwa\Documents\Github\FoodieGemAppDeploy\health-tracking-app
```

### Step 2: Build the APK
Run this command:
```cmd
cd android && gradlew.bat assembleDebug && cd ..
```

**What happens:**
- Downloads dependencies (first time: 5-10 minutes)
- Compiles your React Native code
- Packages everything into an APK
- Saves to: `android\app\build\outputs\apk\debug\app-debug.apk`

### Step 3: Transfer to Your Tecno Phone
**Method A - USB Cable:**
1. Connect your Tecno phone via USB
2. On phone: Swipe down, tap USB notification
3. Select "File Transfer" or "Transfer files"
4. On PC: Open File Explorer → Your Phone → Downloads
5. Copy `app-debug.apk` from `android\app\build\outputs\apk\debug\` to phone's Downloads

**Method B - Cloud Storage:**
1. Upload `app-debug.apk` to Google Drive/OneDrive
2. On phone: Open Drive app and download the APK
3. Tap to install

### Step 4: Install on Phone
1. On your Tecno phone, open **Files** or **Downloads** app
2. Find `app-debug.apk`
3. Tap on it
4. If prompted, tap **"Allow from this source"** or **"Install from Unknown Sources"**
5. Tap **"Install"**
6. Tap **"Open"** when done!

🎉 **Done! Your app is now installed on your Tecno Spark 40C!**

---

## 📱 OPTION 2: Direct USB Development (For Active Development)

**Use this when you want to make changes and see them instantly on your phone!**

### Prerequisites:
1. **Enable Developer Mode on Tecno:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Settings → System → Developer Options
   - Toggle ON: **"USB Debugging"**
   - Toggle ON: **"Install via USB"** (if available)

3. **Connect Phone:**
   - Connect Tecno to PC with USB cable
   - On phone: Tap "Allow USB Debugging" → OK
   - Check "Always allow from this computer"

### Build & Run:
```cmd
adb devices
```
(Should show your device)

Then run:
```cmd
npx react-native run-android
```

**What happens:**
- Builds and installs app on your phone
- Starts Metro bundler
- Opens app automatically
- Changes you make update live!

---

## 🎯 Quick Command Reference

**Build debug APK:**
```cmd
cd android && gradlew.bat assembleDebug && cd ..
```

**Build release APK (smaller, optimized):**
```cmd
cd android && gradlew.bat assembleRelease && cd ..
```

**Check if phone is connected:**
```cmd
adb devices
```

**Run on connected phone:**
```cmd
npx react-native run-android
```

**Start Metro bundler only:**
```cmd
npx react-native start
```

**Clean build (if errors occur):**
```cmd
cd android && gradlew.bat clean && cd ..
```

---

## 🔍 Where to Find Your APK Files

**Debug APK (for testing):**
```
android\app\build\outputs\apk\debug\app-debug.apk
```
Size: ~50-100 MB

**Release APK (optimized):**
```
android\app\build\outputs\apk\release\app-release.apk
```
Size: ~30-60 MB

---

## ⚡ Expected Build Times

**First build:**
- 10-20 minutes (downloading dependencies)

**Subsequent builds:**
- 2-5 minutes (dependencies cached)

**Clean build:**
- 5-10 minutes

---

## 🐛 Troubleshooting

**"JAVA_HOME is not set"**
```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

**"SDK location not found"**
- File already exists at `android\local.properties` ✅
- Should work automatically

**Build fails with errors**
```cmd
cd android
gradlew.bat clean
cd ..
```
Then rebuild

**Phone not detected by ADB**
1. Enable USB Debugging on phone
2. Try different USB cable
3. Restart ADB:
```cmd
adb kill-server
adb start-server
adb devices
```

---

## 📋 Checklist Before Building

- [ ] Connected to internet (for first build)
- [ ] Have 5-10 minutes available (first build)
- [ ] Command Prompt open in project folder
- [ ] Phone ready (for Option 2 only)

---

## 🎉 What to Expect in Your App

Once installed, you'll have:
- 📊 Health Dashboard
- ❤️ Heart Rate Tracking
- 🚶 Steps Counter
- 💊 Medicine Reminders
- 🏆 Milestones & Rewards
- ⚙️ Settings

---

## 🚀 Ready to Build?

**For quickest result, run:**
```cmd
cd android && gradlew.bat assembleDebug && cd ..
```

Then transfer the APK to your Tecno phone and install!

Need help? Let me know which step you're on!
