/*
 * ESP32-S3 Health Watch WiFi Server
 * 
 * This Arduino sketch creates a WiFi web server on your ESP32 that sends
 * health data (steps, heart rate, battery) to your React Native mobile app.
 * 
 * Hardware: ESP32-S3 with QMI8658C IMU sensor
 * 
 * Setup Instructions:
 * 1. Change YOUR_WIFI_NAME and YOUR_WIFI_PASSWORD below
 * 2. Upload this code to your ESP32-S3
 * 3. Open Serial Monitor (115200 baud) to see the IP address
 * 4. Enter that IP address in the mobile app Settings page
 * 5. Tap "Connect Watch" in the app
 * 
 * Author: Created for Health Tracking App Integration
 * Date: November 6, 2025
 */

#include <WiFi.h>
#include <WebServer.h>

// ==================== CONFIGURATION ====================
// CHANGE THESE TO YOUR WIFI CREDENTIALS
const char* ssid = "SW-1009-6517_EXT";          // Your WiFi network name
const char* password = "4e9ebf21a3";  // Your WiFi password

// Create web server on port 80
WebServer server(80);

// ==================== DATA VARIABLES ====================
// These will be replaced with real sensor readings
int stepCount = 0;
int heartRate = 72;
int batteryLevel = 100;
unsigned long lastStepUpdate = 0;

// ==================== SETUP ====================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n========================================");
  Serial.println("ESP32 Health Watch WiFi Server");
  Serial.println("========================================\n");
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  WiFi.setHostname("ESP32-HealthWatch");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\n\n❌ WiFi Connection Failed!");
    Serial.println("Please check:");
    Serial.println("1. WiFi name and password are correct");
    Serial.println("2. ESP32 is in range of WiFi router");
    Serial.println("3. WiFi network is 2.4GHz (ESP32 doesn't support 5GHz)");
    return;
  }
  
  Serial.println("\n\n✅ WiFi Connected Successfully!");
  Serial.println("========================================");
  Serial.print("📡 IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("📶 Signal Strength: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
  Serial.println("========================================\n");
  
  Serial.println("⚠️  IMPORTANT: Enter this IP address in your mobile app!");
  Serial.print("   IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.on("/sync-time", HTTP_POST, handleTimeSync);
  server.on("/weather", HTTP_POST, handleWeather);
  
  // Enable CORS for mobile app
  server.enableCORS(true);
  
  // Start server
  server.begin();
  Serial.println("✅ Web server started!");
  Serial.println("📱 Ready for mobile app connection\n");
  
  // Initialize sensors here if you have them
  // initIMU();
  // initHeartRateSensor();
}

// ==================== MAIN LOOP ====================
void loop() {
  // Handle incoming HTTP requests
  server.handleClient();
  
  // Simulate sensor data updates (replace with real sensor code)
  updateSensorData();
  
  delay(10);
}

// ==================== SENSOR DATA UPDATE ====================
void updateSensorData() {
  unsigned long currentTime = millis();
  
  // Update every 1 second (replace with real sensor readings)
  if (currentTime - lastStepUpdate > 1000) {
    // Simulate step counting (replace with real IMU data)
    stepCount += random(0, 3);
    
    // Simulate heart rate (replace with real sensor)
    heartRate = 60 + random(0, 40);
    
    // Simulate battery drain (replace with real battery monitoring)
    if (random(0, 100) < 2) {  // 2% chance to decrease
      batteryLevel = max(0, batteryLevel - 1);
    }
    
    lastStepUpdate = currentTime;
  }
}

// ==================== WEB SERVER HANDLERS ====================

// Root endpoint - Info page
void handleRoot() {
  String html = "<!DOCTYPE html><html><head>";
  html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
  html += "<style>";
  html += "body { font-family: Arial, sans-serif; margin: 20px; background: #f0f9ff; }";
  html += "h1 { color: #1e40af; }";
  html += ".card { background: white; padding: 20px; border-radius: 10px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }";
  html += ".endpoint { background: #e0f2fe; padding: 10px; border-radius: 5px; margin: 5px 0; }";
  html += ".data { font-size: 24px; font-weight: bold; color: #22c55e; }";
  html += "</style>";
  html += "</head><body>";
  
  html += "<h1>🏥 ESP32 Health Watch</h1>";
  
  html += "<div class='card'>";
  html += "<h2>📊 Current Data</h2>";
  html += "<p>Steps: <span class='data'>" + String(stepCount) + "</span></p>";
  html += "<p>Heart Rate: <span class='data'>" + String(heartRate) + " BPM</span></p>";
  html += "<p>Battery: <span class='data'>" + String(batteryLevel) + "%</span></p>";
  html += "</div>";
  
  html += "<div class='card'>";
  html += "<h2>🔌 API Endpoints</h2>";
  html += "<div class='endpoint'><b>GET /</b> - This info page</div>";
  html += "<div class='endpoint'><b>GET /data</b> - Get sensor data (JSON)</div>";
  html += "<div class='endpoint'><b>POST /sync-time</b> - Sync time from app</div>";
  html += "<div class='endpoint'><b>POST /weather</b> - Receive weather data</div>";
  html += "</div>";
  
  html += "<div class='card'>";
  html += "<h2>📱 Mobile App Connection</h2>";
  html += "<p>1. Open the Health Tracking App</p>";
  html += "<p>2. Go to Settings</p>";
  html += "<p>3. Enter IP: <b>" + WiFi.localIP().toString() + "</b></p>";
  html += "<p>4. Tap 'Connect Watch'</p>";
  html += "</div>";
  
  html += "</body></html>";
  
  server.send(200, "text/html", html);
  Serial.println("📄 Served info page");
}

// Data endpoint - Returns JSON with sensor data
void handleData() {
  // Create JSON response
  String json = "{";
  json += "\"steps\":" + String(stepCount) + ",";
  json += "\"heartRate\":" + String(heartRate) + ",";
  json += "\"battery\":" + String(batteryLevel) + ",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  
  // Send with CORS headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "application/json", json);
  
  Serial.println("📤 Data sent: Steps=" + String(stepCount) + 
                 " HR=" + String(heartRate) + 
                 " Battery=" + String(batteryLevel) + "%");
}

// Time sync endpoint - Receives time from app
void handleTimeSync() {
  if (server.hasArg("timestamp")) {
    String timestamp = server.arg("timestamp");
    Serial.println("🕐 Time synced from app: " + timestamp);
    
    // Here you would update your RTC or time variables
    // For example:
    // updateRTC(timestamp.toInt());
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"status\":\"ok\",\"message\":\"Time synced\"}");
  } else {
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"No timestamp provided\"}");
  }
}

// Weather endpoint - Receives weather data from app
void handleWeather() {
  if (server.hasArg("temperature") && server.hasArg("condition")) {
    String temp = server.arg("temperature");
    String condition = server.arg("condition");
    
    Serial.println("🌤️  Weather update from app:");
    Serial.println("   Temperature: " + temp + "°C");
    Serial.println("   Condition: " + condition);
    
    // Here you would update your display or store the weather data
    // updateDisplay(temp, condition);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"status\":\"ok\",\"message\":\"Weather updated\"}");
  } else {
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"Missing parameters\"}");
  }
}

// ==================== SENSOR INTEGRATION EXAMPLES ====================

/*
// Example: Initialize QMI8658C IMU for step counting
void initIMU() {
  // Add your IMU initialization code here
  // Wire.begin();
  // imu.begin();
  Serial.println("📍 IMU Sensor initialized");
}

// Example: Read steps from IMU
int readSteps() {
  // Add your step counting algorithm here
  // return imu.getStepCount();
  return stepCount;
}

// Example: Read heart rate sensor
int readHeartRate() {
  // Add your heart rate sensor reading code here
  // return heartRateSensor.getBPM();
  return heartRate;
}

// Example: Read battery level
int readBatteryLevel() {
  // Add your battery monitoring code here
  // int voltage = analogRead(BATTERY_PIN);
  // return map(voltage, 0, 4095, 0, 100);
  return batteryLevel;
}
*/

// ==================== UTILITY FUNCTIONS ====================

void printWiFiStatus() {
  Serial.println("\n📊 WiFi Status:");
  Serial.print("   SSID: ");
  Serial.println(WiFi.SSID());
  Serial.print("   IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("   Signal: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
}

// ==================== END OF FILE ====================
