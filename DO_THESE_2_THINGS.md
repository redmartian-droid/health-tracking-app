# ⚡ Quick Setup - Do These 2 Things! ⚡

I've set up everything I can programmatically. You just need to do these 2 quick things:

---

## 📋 THING 1: Set ANDROID_HOME (2 minutes)

### Step-by-Step:

1. **Press `Win + R` on your keyboard**
2. **Type:** `sysdm.cpl`
3. **Press Enter**

4. **Click "Environment Variables"** button (bottom right)

5. **Under "System variables" section (bottom half):**
   - Click **"New"**
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\ldlwa\AppData\Local\Android\Sdk`
   - Click **OK**

6. **Find "Path" in System variables:**
   - Select "Path"
   - Click **"Edit"**
   - Click **"New"**
   - Add: `C:\Users\ldlwa\AppData\Local\Android\Sdk\platform-tools`
   - Click **"New"** again
   - Add: `C:\Users\ldlwa\AppData\Local\Android\Sdk\tools`
   - Click **OK** on all windows

7. **Close and reopen any Command Prompt/PowerShell windows**

### ✅ To verify it worked:
Open a NEW Command Prompt and type:
```cmd
adb version
```
If you see version info, you're good!

---

## 📱 THING 2: Enable USB Debugging on Your Tecno Phone (1 minute)

### Step-by-Step:

1. **On your Tecno phone, go to Settings**

2. **Scroll down to "About Phone"** (or "System" → "About Phone")

3. **Find "Build Number"**

4. **Tap "Build Number" 7 times rapidly**
   - You'll see a message: "You are now a developer!"

5. **Go back to Settings**

6. **Find "Developer Options"** (might be under System or Additional Settings)

7. **Turn ON "Developer Options"**

8. **Scroll down and enable:**
   - ✅ **USB Debugging**
   - ✅ **Install via USB** (if available)

9. **Connect your phone to PC with USB cable**

10. **On your phone, a popup will appear:**
    - "Allow USB Debugging?"
    - Check "Always allow from this computer"
    - Tap **OK**

---

## 🚀 After You Do These 2 Things:

### Test if phone is connected:
```cmd
adb devices
```

Should show:
```
List of devices attached
ABC123456789    device
```

### Then run the app:
```cmd
npx react-native run-android
```

---

## ⏱️ Time Estimate:
- Thing 1 (ANDROID_HOME): 2 minutes
- Thing 2 (USB Debugging): 1 minute
- **Total: 3 minutes!**

---

## 🆘 If You Get Stuck:

### ANDROID_HOME not working?
- Make sure you closed and reopened Command Prompt
- Double-check the path: `C:\Users\ldlwa\AppData\Local\Android\Sdk`
- Restart your computer if needed

### Phone not detected?
- Make sure USB Debugging is enabled
- Try a different USB cable (some are charge-only)
- Change USB mode on phone to "File Transfer"
- Run: `adb kill-server` then `adb start-server`

---

Let me know when you've done these 2 things and I'll help you run the app! 🎉
