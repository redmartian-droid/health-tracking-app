# Android Studio Setup Guide

## 🎯 Current Status
- ✅ **Java JDK** - Installed but needs PATH configuration
- ⏳ **Android Studio** - Almost done installing

## Step 1: Fix Java PATH (Do This First)

Since Java is installed but not recognized, we need to add it to PATH:

### Find Your Java Installation
Java is likely installed in one of these locations:
- `C:\Program Files\Java\jdk-17.x.x`
- `C:\Program Files\Java\jdk-11.x.x`
- `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
- `C:\Program Files\Microsoft\jdk-17.x.x`

### Set Environment Variables
1. **Open System Properties:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"

2. **Add JAVA_HOME:**
   - Click "New" under System Variables
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17.x.x` (use your actual path)

3. **Update PATH:**
   - Find "Path" in System Variables, click "Edit"
   - Click "New" and add: `%JAVA_HOME%\bin`

4. **Apply and restart your terminal**

## Step 2: Android Studio Initial Setup

When Android Studio finishes installing:

### 1. First Launch
- Start Android Studio
- Choose "Do not import settings" (if first time)
- Click "Next" through the welcome screens

### 2. Choose Installation Type
- Select **"Custom"** installation (not Standard)
- This gives you control over what gets installed

### 3. Select Components
Make sure these are checked:
- ✅ **Android SDK**
- ✅ **Android SDK Platform**
- ✅ **Performance (Intel HAXM)** (if available)
- ✅ **Android Virtual Device**

### 4. SDK Location
- Accept the default SDK location: `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
- **Remember this path** - you'll need it for ANDROID_HOME

### 5. Emulator Settings
- Accept default settings for Android Emulator
- Click "Next" and "Finish"

## Step 3: Install Required SDK Components

After Android Studio opens:

### 1. Open SDK Manager
- Go to **File → Settings** (or **Android Studio → Preferences** on Mac)
- Navigate to **Appearance & Behavior → System Settings → Android SDK**

### 2. Install SDK Platforms
In the **SDK Platforms** tab, install:
- ✅ **Android 13.0 (Tiramisu) - API Level 33**
- ✅ **Android 12.0 (S) - API Level 31**
- ✅ **Android 11.0 (R) - API Level 30** (optional)

### 3. Install SDK Tools
In the **SDK Tools** tab, make sure these are installed:
- ✅ **Android SDK Build-Tools** (latest version)
- ✅ **Android SDK Command-line Tools** (latest)
- ✅ **Android SDK Platform-Tools**
- ✅ **Android Emulator**
- ✅ **Intel x86 Emulator Accelerator (HAXM installer)** (if available)

### 4. Apply Changes
- Click "Apply" and "OK"
- Let Android Studio download and install everything

## Step 4: Set Android Environment Variables

### Add ANDROID_HOME
1. **Open System Properties** again (`Win + R`, `sysdm.cpl`)
2. **Environment Variables**
3. **Add new System Variable:**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`

### Update PATH
Add these to your PATH (System Variables):
- `%ANDROID_HOME%\platform-tools`
- `%ANDROID_HOME%\tools`
- `%ANDROID_HOME%\tools\bin`

## Step 5: Create Virtual Device (Optional)

### 1. Open AVD Manager
- In Android Studio: **Tools → AVD Manager**
- Or click the phone icon in the toolbar

### 2. Create Virtual Device
- Click "Create Virtual Device"
- Choose **Phone → Pixel 4** (or similar)
- Click "Next"

### 3. Select System Image
- Choose **API Level 31** or **33**
- Download if needed (click the download icon)
- Click "Next"

### 4. Finish Setup
- Give it a name like "Pixel_4_API_31"
- Click "Finish"

## Step 6: Verify Everything Works

### 1. Restart Your Computer
This ensures all environment variables are loaded properly.

### 2. Test Commands
Open a new Command Prompt and run:
```cmd
java -version
adb version
npx react-native doctor
```

All commands should work without errors.

## Step 7: Install React Native Dependencies

Once everything is set up:
```cmd
npm install
```

This will install all the React Native packages for your health tracking app.

## Next Steps After Setup

1. **Test the setup**: `npx react-native doctor`
2. **Run the app**: `npx react-native run-android`
3. **Connect your phone** or use the emulator

Let me know when you've completed the Android Studio setup and I'll help you run your converted health tracking app!
