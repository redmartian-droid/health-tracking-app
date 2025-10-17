# Java JDK Installation for React Native

## Working Download Options

### Option 1: Oracle JDK (Recommended)
1. Go to: **https://www.oracle.com/java/technologies/downloads/**
2. Select **Java 17** or **Java 11**
3. Choose **Windows x64 Installer**
4. Download and run the `.exe` file

### Option 2: Eclipse Temurin (Alternative)
1. Go to: **https://adoptium.net/temurin/releases/**
2. Select **JDK 17** from the dropdown
3. Choose **Windows x64** and **JDK**
4. Download the `.msi` file

### Option 3: Microsoft OpenJDK
1. Go to: **https://learn.microsoft.com/en-us/java/openjdk/download**
2. Download **Microsoft Build of OpenJDK 17**
3. Choose the Windows x64 `.msi` installer

## Installation Steps

1. **Download** any JDK from the options above (JDK 17 recommended)
2. **Run the installer** with Administrator privileges
3. **Accept all defaults** - the installer will set up JAVA_HOME automatically
4. **Restart your terminal** after installation

## Verify Installation

Open a new Command Prompt and run:
```cmd
java -version
javac -version
echo %JAVA_HOME%
```

You should see output like:
```
java version "17.0.x" 2023-xx-xx
Java(TM) SE Runtime Environment (build 17.0.x+xx-xxx)
Java HotSpot(TM) 64-Bit Server VM (build 17.0.x+xx-xxx, mixed mode, sharing)
```

## If Java Commands Don't Work

If you get "java is not recognized", manually set environment variables:

1. **Open System Properties:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"

2. **Add JAVA_HOME:**
   - Click "New" under System Variables
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Java\jdk-17` (or similar path)
   - Check your actual installation path in Program Files

3. **Update PATH:**
   - Find "Path" in System Variables, click "Edit"
   - Click "New" and add: `%JAVA_HOME%\bin`

4. **Restart your computer** for changes to take effect

## Alternative: Use Chocolatey (If You Have It)

If you have Chocolatey package manager installed:
```cmd
choco install openjdk17
```

## Next Steps After Java Installation

1. Verify Java works: `java -version`
2. Complete Android Studio installation
3. Set up Android SDK and environment variables
4. Run: `npx react-native doctor` to check everything

Let me know when Java is installed and I'll help you with the Android Studio setup!
