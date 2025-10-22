# 🔧 Switch to Java 17

Java 25 is still active. Let's find and activate Java 17.

---

## Check if Java 17 is Installed:

### Option 1: Search in Program Files

Run this in Command Prompt:
```cmd
dir "C:\Program Files\Java" /s /b | findstr "17"
```

OR

```cmd
dir "C:\Program Files" /s /b | findstr "jdk-17"
```

---

## If Java 17 is NOT Installed:

### Download and Install:

1. **Go to**: https://adoptium.net/temurin/releases/
2. **Select**:
   - Version: **17 - LTS**
   - Operating System: Windows
   - Architecture: x64
3. **Download** the .msi installer
4. **Run installer** and:
   - ✅ Check "Set JAVA_HOME variable"
   - ✅ Check "JavaSoft (Oracle) registry keys"
   - ✅ Check "Add to PATH"
5. **Complete installation**

---

## If Java 17 IS Installed:

### Set JAVA_HOME to Java 17:

1. **Find Java 17 path**. It's usually:
   - `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
   - `C:\Program Files\Java\jdk-17`
   - `C:\Program Files\Temurin\jdk-17.x.x`

2. **Set JAVA_HOME**:
   - Press `Win + R`
   - Type: `sysdm.cpl`
   - Click "Environment Variables"
   - Under "System variables", find `JAVA_HOME`
   - Click "Edit"
   - Change value to Java 17 path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.9-hotspot`)
   - Click OK on all windows

3. **Update PATH**:
   - In same Environment Variables window
   - Find `Path` under System variables
   - Click Edit
   - Find any Java 25 entries
   - Move Java 17 entry to the top OR remove Java 25 entry
   - Click OK

4. **Restart Command Prompt** (or restart PC for sure)

5. **Verify**:
   ```cmd
   java -version
   ```
   Should show: `openjdk version "17.0.x"`

---

## Quick Test After Setup:

```cmd
java -version
```
Should show 17, not 25!

Then build your app:
```cmd
cd C:\Users\ldlwa\Documents\Github\FoodieGemAppDeploy\health-tracking-app
npx react-native run-android
```

---

## 🎯 Alternative: Use Gradle with Specific Java

If you can't change system Java, you can tell Gradle to use Java 17:

1. **Find Java 17 path** (from above)

2. **Set in gradle.properties**:
   Add this line to `android/gradle.properties`:
   ```
   org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.9-hotspot
   ```
   (Use YOUR Java 17 path with double backslashes)

3. **Build**:
   ```cmd
   npx react-native run-android
   ```

---

## ✅ Success Indicators:

**After switching to Java 17:**
- `java -version` shows 17.0.x
- Build starts without "What went wrong: 25" error
- App builds successfully
- Installs on your Tecno phone
- Health Tracker launches! 🎉

---

**Try these steps and let me know what you find!**
