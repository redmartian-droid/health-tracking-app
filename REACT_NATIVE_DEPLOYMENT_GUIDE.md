# Health Tracker React Native - Deployment Guide

## Overview
Your React web app has been successfully converted to React Native! This guide will help you set up and deploy the app to an Android device.

## Project Structure
```
health-tracking-app/
├── App-RN.js                    # Main React Native App component
├── package-rn.json             # React Native dependencies
├── metro.config.js              # Metro bundler configuration
├── android/                     # Android-specific files
│   └── app/
│       └── build.gradle         # Android build configuration
└── src/
    ├── components-rn/           # React Native components
    │   ├── Dashboard.js
    │   ├── HeartRatePage.js
    │   ├── StepsPage.js
    │   ├── MedicinePage.js
    │   ├── MilestonesPage.js
    │   ├── RewardsPage.js
    │   ├── SettingsPage.js
    │   ├── SignIn.js
    │   ├── SignUp.js
    │   ├── MetricCard.js
    │   └── HeartRateMetricCard.js
    └── services/
        └── api.js               # API service (reused from web app)
```

## Prerequisites

### 1. Install Node.js and npm
- Download and install Node.js (v16 or higher) from https://nodejs.org/
- Verify installation: `node --version` and `npm --version`

### 2. Install Java Development Kit (JDK)
- Install JDK 11 or higher
- Set JAVA_HOME environment variable

### 3. Install Android Studio
- Download from https://developer.android.com/studio
- Install Android SDK (API level 31 or higher)
- Set ANDROID_HOME environment variable
- Add platform-tools to PATH

### 4. Enable Developer Options on Android Device
- Go to Settings > About Phone
- Tap "Build Number" 7 times
- Go back to Settings > Developer Options
- Enable "USB Debugging"

## Setup Instructions

### Step 1: Install React Native CLI
```bash
npm install -g @react-native-community/cli
```

### Step 2: Create React Native Project Structure
Since we can't use the CLI directly, you'll need to:

1. **Create the basic React Native project structure manually:**
```bash
# Create necessary directories
mkdir -p android/app/src/main/java/com/healthtrackern
mkdir -p android/app/src/main/res
mkdir -p ios
```

2. **Copy the package.json:**
```bash
cp package-rn.json package.json
```

3. **Install dependencies:**
```bash
npm install
```

### Step 3: Set up Android Configuration

1. **Create android/build.gradle:**
```gradle
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
        ndkVersion = "23.1.7779620"
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.3.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url "https://www.jitpack.io" }
    }
}
```

2. **Create android/gradle.properties:**
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
android.useAndroidX=true
android.enableJetifier=true
newArchEnabled=false
hermesEnabled=true
```

3. **Create android/settings.gradle:**
```gradle
rootProject.name = 'HealthTrackerRN'
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
```

### Step 4: Create Main Activity Files

1. **Create android/app/src/main/java/com/healthtrackern/MainActivity.java:**
```java
package com.healthtrackern;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "HealthTrackerRN";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
```

2. **Create android/app/src/main/java/com/healthtrackern/MainApplication.java:**
```java
package com.healthtrackern;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}
```

### Step 5: Create Android Manifest

**Create android/app/src/main/AndroidManifest.xml:**
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

### Step 6: Create Entry Point

**Create index.js in the root directory:**
```javascript
import {AppRegistry} from 'react-native';
import App from './App-RN';
import {name as appName} from './package.json';

AppRegistry.registerComponent(appName, () => App);
```

### Step 7: Set up Vector Icons

1. **Link vector icons for Android:**
```bash
# Copy fonts to android assets
mkdir -p android/app/src/main/assets/fonts
cp node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf android/app/src/main/assets/fonts/
```

2. **Add to android/app/build.gradle (already included in the provided file):**
```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

## Building and Running

### Development Build

1. **Start Metro bundler:**
```bash
npx react-native start
```

2. **In a new terminal, run on Android:**
```bash
npx react-native run-android
```

### Production Build

1. **Generate signed APK:**
```bash
cd android
./gradlew assembleRelease
```

2. **Find APK at:**
```
android/app/build/outputs/apk/release/app-release.apk
```

## Installing on Android Device

### Method 1: USB Debugging
1. Connect device via USB
2. Enable USB debugging
3. Run: `npx react-native run-android`

### Method 2: APK Installation
1. Build release APK (see above)
2. Transfer APK to device
3. Enable "Install from unknown sources"
4. Install APK

### Method 3: Google Play Store (Production)
1. Create signed release APK
2. Create Google Play Developer account
3. Upload APK to Play Console
4. Follow Play Store guidelines

## Key Differences from Web Version

### Navigation
- **Web:** React Router DOM
- **React Native:** React Navigation with Tab Navigator

### Styling
- **Web:** CSS classes and Tailwind
- **React Native:** StyleSheet objects with flexbox

### Components
- **Web:** HTML elements (`div`, `button`, etc.)
- **React Native:** Native components (`View`, `TouchableOpacity`, etc.)

### Icons
- **Web:** Lucide React icons
- **React Native:** React Native Vector Icons (Material Icons)

## Troubleshooting

### Common Issues

1. **Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

2. **Android build failures:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

3. **Vector icons not showing:**
- Ensure fonts are copied to android/app/src/main/assets/fonts/
- Rebuild the app

4. **Permission errors:**
- Check Android permissions in AndroidManifest.xml
- Enable USB debugging on device

### Performance Optimization

1. **Enable Hermes:** Already enabled in gradle.properties
2. **Optimize images:** Use appropriate sizes and formats
3. **Code splitting:** Implement lazy loading for large components
4. **Memory management:** Use FlatList for large lists

## Next Steps

1. **Test thoroughly** on different Android devices
2. **Add crash reporting** (e.g., Crashlytics)
3. **Implement push notifications** if needed
4. **Add analytics** (e.g., Google Analytics)
5. **Set up CI/CD** for automated builds
6. **Prepare for Play Store** submission

## Smart Watch Integration

Your existing smart watch code should work with React Native. You may need to:

1. **Create a bridge** between React Native and native Android code
2. **Use react-native-ble-plx** for Bluetooth communication
3. **Implement native modules** for device-specific features

## Support

For React Native specific issues:
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Community](https://github.com/react-native-community)

Your Health Tracker app is now ready for Android deployment! 🚀
