# 🧹 Clean Gradle Cache & Build

The error is from Gradle's cached Kotlin files. Let's clean them:

---

## Option 1: Clean in Android Studio (Easiest)

### Step 1: Invalidate Caches
1. **File → Invalidate Caches / Restart...**
2. **Check ALL boxes:**
   - ✅ Clear file system cache and Local History
   - ✅ Clear downloaded shared indexes
   - ✅ Clear VCS Log caches and indexes
   - ✅ Wipe IDE system caches
3. Click **"Invalidate and Restart"**

### Step 2: After Restart
1. Wait for Android Studio to reopen
2. Let it re-index (progress bar at bottom)
3. Click **"Sync Project with Gradle Files"**
4. Then click **▶ Run**

---

## Option 2: Clean from Command Line

Run these commands in your project root:

```cmd
cd android
gradlew.bat clean
gradlew.bat --stop
cd ..
rmdir /S /Q android\.gradle
rmdir /S /Q android\app\build
cd android
gradlew.bat assembleDebug
```

This will:
1. Clean the project
2. Stop all Gradle daemons
3. Delete local Gradle cache
4. Delete build folders
5. Rebuild from scratch

---

## Option 3: Quick Fix - Delete Gradle User Cache

Close Android Studio, then:

```cmd
rmdir /S /Q C:\Users\ldlwa\.gradle\caches
```

Then reopen Android Studio and sync.

---

## 🎯 Recommended: Option 1

The easiest and safest is Option 1 in Android Studio:
1. Invalidate Caches
2. Restart
3. Sync
4. Run

This will download fresh Kotlin libraries and build correctly.

---

## ✅ After Cleaning:

When you run the app:
- ✅ Fresh Kotlin 1.9.0 libraries download
- ✅ No cache conflicts
- ✅ Build succeeds
- ✅ App installs on your Tecno phone
- ✅ Health Tracker launches! 🎉

---

**Try Option 1 now in Android Studio!**

Click File → Invalidate Caches / Restart...
