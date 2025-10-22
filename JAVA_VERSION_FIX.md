# Java Version Compatibility Issue - SOLUTION

## The Problem
Your Android build is failing because:
1. ✅ FIXED: Missing FLIPPER_VERSION property (now added to gradle.properties)
2. ❌ ISSUE: You have Java 25 installed, but Gradle 8.5 cannot work with Java 25

**Error:** `java.lang.IllegalArgumentException: 25` - Gradle doesn't recognize Java 25

## Your Current Setup
- Java installed: **Java 25** (C:\Program Files\Eclipse Adoptium\jdk-25.0.0.36-hotspot)
- Java required: **Java 17** (as specified in android/app/build.gradle)

## SOLUTION: Install Java 17

### Option 1: Download and Install Java 17 (RECOMMENDED)

1. **Download Java 17 (Temurin):**
   - Go to: https://adoptium.net/temurin/releases/
   - Select:
     - Version: **17 - LTS**
     - Operating System: **Windows**
     - Architecture: **x64**
   - Download the **.msi** installer

2. **Install Java 17:**
   - Run the downloaded .msi file
   - Follow the installation wizard
   - **Important:** Check the option to "Set JAVA_HOME variable" during installation
   - Complete the installation

3. **Verify Installation:**
   Open a NEW command prompt and run:
   ```
   java -version
   ```
   It should show Java 17

4. **Build Your App:**
   ```
   cd C:\Users\ldlwa\Documents\Github\FoodieGemAppDeploy\health-tracking-app
   cd android && gradlew.bat assembleDebug && cd ..
   ```

### Option 2: Set JAVA_HOME Temporarily

If you want to keep Java 25 but use Java 17 for this project only:

1. First install Java 17 using Option 1 above
2. Create a file `android/build-with-java17.bat` with:
   ```batch
   @echo off
   set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
   set PATH=%JAVA_HOME%\bin;%PATH%
   gradlew.bat assembleDebug
   ```
   (Replace `jdk-17.x.x-hotspot` with actual Java 17 folder name)

### Option 3: Use Gradle Toolchain (Advanced)

Add this to `android/build.gradle` (not app/build.gradle):
```gradle
allprojects {
    tasks.withType(JavaCompile).configureEach {
        options.release = 17
    }
}
```

## Why Java 17?
- React Native Android builds require Java 17 (LTS version)
- Your project's build.gradle specifies Java 17 compatibility
- Gradle 8.5 works best with Java 11-20, but Java 17 is the sweet spot
- Android Studio also recommends Java 17 for React Native development

## Next Steps After Installing Java 17

1. Close all terminal windows
2. Open a NEW command prompt
3. Navigate to your project:
   ```
   cd C:\Users\ldlwa\Documents\Github\FoodieGemAppDeploy\health-tracking-app
   ```
4. Build the APK:
   ```
   cd android && gradlew.bat assembleDebug && cd ..
   ```
5. The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## What I Fixed Already
- ✅ Added FLIPPER_VERSION=0.182.0 to gradle.properties
- ✅ Added hermesEnabled=true to gradle.properties

## What You Need To Do
- ⬜ Install Java 17 using the link above
- ⬜ Restart your terminal
- ⬜ Run the build command again
