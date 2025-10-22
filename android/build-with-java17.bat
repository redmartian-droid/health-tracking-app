@echo off
echo =====================================================
echo Building Android APK with Java 17
echo =====================================================
echo.

REM Stop any running Gradle daemons
echo Stopping Gradle daemons...
call gradlew.bat --stop

REM Set Java 17 path
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo.
echo Using Java from: %JAVA_HOME%
echo.

REM Verify Java version
"%JAVA_HOME%\bin\java.exe" -version
echo.

REM Clean and build
echo Starting build...
echo.
call gradlew.bat clean assembleDebug

echo.
echo =====================================================
if %ERRORLEVEL% EQU 0 (
    echo BUILD SUCCESSFUL!
    echo.
    echo APK Location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo BUILD FAILED!
    echo Error code: %ERRORLEVEL%
)
echo =====================================================
pause
