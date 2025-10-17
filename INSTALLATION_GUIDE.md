# Installation Guide for React Native Development

## Current Status
✅ **Node.js v22.17.0** - Already installed and working
❌ **Java JDK** - Not installed
❌ **React Native CLI** - PowerShell execution policy blocking npm
⏳ **Android Studio** - Currently downloading

## Step 1: Fix PowerShell Execution Policy

### Option A: Temporary Fix (Recommended)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option B: Use Command Prompt Instead
Open Command Prompt (cmd) as Administrator and use:
```cmd
npm install -g @react-native-community/cli
```

## Step 2: Install Java JDK

### Download and Install JDK 11 or 17
1. Go to: https://adoptium.net/temurin/releases/
2. Download **JDK 11** or **JDK 17** for Windows x64
3. Run the installer with default settings
4. The installer should automatically set JAVA_HOME

### Verify Java Installation
After installation, open a new terminal and run:
```cmd
java -version
javac -version
```

### Manual JAVA_HOME Setup (if needed)
If Java commands don't work:
1. Open System Properties → Advanced → Environment Variables
2. Add new System Variable:
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-11.0.xx-hotspot` (adjust path)
3. Add to PATH: `%JAVA_HOME%\bin`

## Step 3: Install React Native CLI

After fixing PowerShell policy or using cmd:
```cmd
npm install -g @react-native-community/cli
```

Verify installation:
```cmd
npx react-native --version
```

## Step 4: Android Studio Setup (After Download Completes)

### During Installation:
1. Choose "Custom" installation
2. Select these components:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Performance (Intel HAXM) - if available

### After Installation:
1. Open Android Studio
2. Go to File → Settings → Appearance & Behavior → System Settings → Android SDK
3. Install these SDK platforms:
   - Android 13 (API level 33)
   - Android 12 (API level 31)
4. Go to SDK Tools tab and install:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator

### Set Environment Variables:
1. Add System Variable:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
2. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

## Step 5: Create Virtual Device (Optional for Testing)

1. In Android Studio: Tools → AVD Manager
2. Create Virtual Device
3. Choose a device (e.g., Pixel 4)
4. Download and select a system image (API 31 or 33)
5. Finish setup

## Step 6: Verify Everything Works

Open Command Prompt and run:
```cmd
npx react-native doctor
```

This will check all your installations and highlight any issues.

## Step 7: Set Up Your React Native Project

1. **Copy package.json:**
```cmd
copy package-rn.json package.json
```

2. **Install project dependencies:**
```cmd
npm install
```

3. **Create required Android files** (I'll help you with this after the basic setup)

## Troubleshooting

### PowerShell Issues:
- Use Command Prompt (cmd) instead of PowerShell
- Or run PowerShell as Administrator and change execution policy

### Java Issues:
- Make sure JAVA_HOME points to JDK folder (not JRE)
- Restart terminal after setting environment variables
- Use JDK 11 or 17 (avoid newer versions for React Native)

### Android Studio Issues:
- Make sure SDK path doesn't have spaces
- Install SDK components through Android Studio, not manually
- Restart computer after setting ANDROID_HOME

## Next Steps After Installation

1. Verify all tools with `npx react-native doctor`
2. Set up the Android project structure
3. Create the required Android files
4. Test the app on emulator or device

Let me know when you've completed these steps and I'll help you with the next phase!
