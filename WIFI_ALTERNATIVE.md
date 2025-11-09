# WiFi Alternative to BLE (Recommended for Expo Go)

## ⭐ Why WiFi is Better for Your Use Case

### Advantages over Bluetooth

| Feature | Bluetooth (BLE) | WiFi (HTTP) |
|---------|----------------|-------------|
| **Works in Expo Go** | ❌ No (needs custom build) | ✅ YES! |
| **Setup Time** | 30+ minutes | 5 minutes |
| **Range** | ~10 meters | ~50+ meters (home WiFi) |
| **Battery Impact** | Medium | Low (when idle) |
| **Data Transfer** | Limited | Fast |
| **Debugging** | Hard | Easy (browser, Postman) |
| **Native Code** | Required | None needed |
| **Implementation** | Complex | Simple |

### WiFi is Perfect Because:
- ✅ **No custom build needed** - Works immediately in Expo Go
- ✅ **Easier to debug** - Use browser to test ESP32 directly
- ✅ **Longer range** - Works anywhere on your WiFi network
- ✅ **Simple HTTP requests** - Standard web technology
- ✅ **More reliable** - Less connection drops
- ✅ **Faster development** - Test changes instantly

---

## How It Works

### Architecture

```
┌─────────────────┐         WiFi         ┌─────────────────┐
│                 │   HTTP Requests      │                 │
│   Mobile App    │  ◄────────────►      │  ESP32 Watch    │
│  (React Native) │  JSON Data           │  (Web Server)   │
│                 │                      │                 │
└─────────────────┘                      └─────────────────┘
       │                                          │
       │                                          │
       ▼                                          ▼
   Firebase                                  QMI8658C
   Cloud Storage                             IMU Sensor
```

### Communication Flow

1. **ESP32 creates WiFi web server** (on port 80 or 8080)
2. **Mobile app sends HTTP GET request** to `http://192.168.x.x/data`
3. **ESP32 responds with JSON** containing steps, heart rate, battery
4. **App updates UI** with real data

---

## Implementation Guide

### Part 1: ESP32 WiFi Server (Arduino Code)

Create a new Arduino sketch:

```cpp
#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Create web server on port 80
WebServer server(80);

// Mock data (replace with real sensor readings)
int stepCount = 0;
int heartRate = 72;
int batteryLevel = 85;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());  // Important: Note this IP!
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.on("/sync-time", handleTimeSync);
  
  // Enable CORS for mobile app
  server.enableCORS(true);
  
  // Start server
  server.begin();
  Serial.println("Web server started!");
}

void loop() {
  server.handleClient();
  
  // Simulate step counting (replace with real IMU code)
  static unsigned long lastUpdate = 0;
  if (millis() - lastUpdate > 1000) {
    stepCount += random(0, 3);
    heartRate = 60 + random(0, 40);
    batteryLevel = max(0, batteryLevel - random(0, 2));
    lastUpdate = millis();
  }
}

// Root endpoint - info page
void handleRoot() {
  String html = "<h1>ESP32 Health Watch</h1>";
  html += "<p>API Endpoints:</p>";
  html += "<ul>";
  html += "<li><a href='/data'>/data</a> - Get sensor data</li>";
  html += "<li>/sync-time - Sync time (POST)</li>";
  html += "</ul>";
  
  server.send(200, "text/html", html);
}

// Data endpoint - returns JSON
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
  server.send(200, "application/json", json);
  
  Serial.println("Data sent: " + json);
}

// Time sync endpoint
void handleTimeSync() {
  if (server.method() == HTTP_POST) {
    String timestamp = server.arg("timestamp");
    Serial.println("Time synced: " + timestamp);
    
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"status\":\"ok\"}");
  }
}
```

**Upload this to your ESP32 and note the IP address shown in Serial Monitor!**

---

### Part 2: Mobile App WiFi Service

Create `src/services/wifiService.js`:

```javascript
/**
 * WiFi Service for ESP32-S3 Smartwatch Integration
 * Simple HTTP-based communication - works with Expo Go!
 */

class WiFiService {
  constructor() {
    // Default ESP32 IP (change this to your ESP32's IP)
    this.esp32IP = '192.168.1.100'; // CHANGE THIS!
    this.esp32Port = 80;
    this.isConnected = false;
    this.pollingInterval = null;
    
    // Data cache
    this.dataCache = {
      steps: 0,
      heartRate: 0,
      battery: 100,
      lastUpdate: null,
    };
    
    // Event listeners
    this.listeners = {
      onConnectionChange: [],
      onDataReceived: [],
      onError: [],
    };
  }

  /**
   * Set ESP32 IP address
   */
  setESP32Address(ip, port = 80) {
    this.esp32IP = ip;
    this.esp32Port = port;
    console.log(`ESP32 address set to: http://${ip}:${port}`);
  }

  /**
   * Get base URL
   */
  getBaseURL() {
    return `http://${this.esp32IP}:${this.esp32Port}`;
  }

  /**
   * Test connection to ESP32
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.getBaseURL()}/`, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        this.isConnected = true;
        this.notifyConnectionChange(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      this.isConnected = false;
      this.notifyConnectionChange(false);
      return false;
    }
  }

  /**
   * Fetch data from ESP32
   */
  async fetchData() {
    try {
      const response = await fetch(`${this.getBaseURL()}/data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update cache
      this.dataCache = {
        steps: data.steps || 0,
        heartRate: data.heartRate || 0,
        battery: data.battery || 100,
        lastUpdate: new Date(),
      };

      this.isConnected = true;
      this.notifyConnectionChange(true);
      this.notifyDataReceived(this.dataCache);
      
      return this.dataCache;
    } catch (error) {
      console.error('Fetch data error:', error);
      this.isConnected = false;
      this.notifyConnectionChange(false);
      this.notifyError(error);
      throw error;
    }
  }

  /**
   * Start auto-polling for data
   */
  startPolling(intervalMs = 5000) {
    if (this.pollingInterval) {
      this.stopPolling();
    }

    console.log(`Starting polling every ${intervalMs}ms`);
    
    // Initial fetch
    this.fetchData();
    
    // Set up interval
    this.pollingInterval = setInterval(() => {
      this.fetchData();
    }, intervalMs);
  }

  /**
   * Stop auto-polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Polling stopped');
    }
  }

  /**
   * Sync time to ESP32
   */
  async syncTime() {
    try {
      const now = Math.floor(Date.now() / 1000);
      
      const response = await fetch(`${this.getBaseURL()}/sync-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `timestamp=${now}`,
      });

      if (response.ok) {
        console.log('Time synced successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Time sync error:', error);
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Get cached data
   */
  getCachedData() {
    return { ...this.dataCache };
  }

  /**
   * Disconnect (stop polling)
   */
  async disconnect() {
    this.stopPolling();
    this.isConnected = false;
    this.notifyConnectionChange(false);
  }

  /**
   * Event listener management
   */
  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  notifyConnectionChange(connected) {
    this.listeners.onConnectionChange.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Event callback error:', error);
      }
    });
  }

  notifyDataReceived(data) {
    this.listeners.onDataReceived.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Event callback error:', error);
      }
    });
  }

  notifyError(error) {
    this.listeners.onError.forEach(callback => {
      try {
        callback(error);
      } catch (error) {
        console.error('Event callback error:', error);
      }
    });
  }
}

// Export singleton instance
export default new WiFiService();
```

---

### Part 3: Update API Service

In `src/services/api.js`, replace bleService with wifiService:

```javascript
import wifiService from './wifiService';

// In getHeartRate and getSteps functions:
const watchData = wifiService.getCachedData();
```

---

### Part 4: Update Settings Page

Add IP address input field in SettingsPage.js:

```javascript
const [esp32IP, setESP32IP] = useState('192.168.1.100');

// Add this before the Connect button:
<View style={styles.inputGroup}>
  <Text style={styles.inputLabel}>ESP32 IP Address</Text>
  <TextInput
    style={styles.input}
    value={esp32IP}
    onChangeText={setESP32IP}
    placeholder="192.168.1.100"
    keyboardType="numeric"
  />
</View>

// Update connect handler:
const handleConnectWatch = async () => {
  setIsScanning(true);
  wifiService.setESP32Address(esp32IP);
  
  const connected = await wifiService.testConnection();
  if (connected) {
    wifiService.startPolling(5000); // Poll every 5 seconds
  }
  setIsScanning(false);
};
```

---

## Quick Setup (5 Minutes!)

### Step 1: Upload ESP32 Code
```
1. Open Arduino IDE
2. Paste the WiFi server code
3. Change WiFi name and password
4. Upload to ESP32
5. Open Serial Monitor - note the IP address!
```

### Step 2: Update Mobile App
```
1. Create src/services/wifiService.js
2. Update src/services/api.js to use wifiService
3. Update SettingsPage.js with IP input field
4. Run: npm start
```

### Step 3: Connect!
```
1. Open app in Expo Go
2. Go to Settings
3. Enter ESP32 IP address
4. Tap Connect
5. Done! Real-time data flowing! 🎉
```

---

## Testing

### Test ESP32 Server from Browser

Open your phone/computer browser:
```
http://192.168.1.100/        → See info page
http://192.168.1.100/data    → See JSON data
```

You should see:
```json
{
  "steps": 1234,
  "heartRate": 72,
  "battery": 85,
  "timestamp": 123456
}
```

---

## Comparison: BLE vs WiFi

### BLE Approach
- ⏱️ **Setup:** 30-60 minutes (custom build + debugging)
- 📱 **Compatibility:** Needs custom development build
- 🔧 **Complexity:** High (native modules, packets, UUIDs)
- 🐛 **Debugging:** Difficult (need BLE scanner apps)
- 📏 **Range:** ~10 meters
- 🔋 **Battery:** Medium drain

### WiFi Approach (Recommended)
- ⏱️ **Setup:** 5-10 minutes
- 📱 **Compatibility:** Works in Expo Go immediately!
- 🔧 **Complexity:** Low (just HTTP requests)
- 🐛 **Debugging:** Easy (use browser, Postman)
- 📏 **Range:** 50+ meters (whole house)
- 🔋 **Battery:** Low drain (when polling is reasonable)

---

## Best Practices

### 1. Power Management
```cpp
// On ESP32: Use deep sleep when idle
if (noActivity > 60000) { // 1 minute
  esp_deep_sleep_start();
}
```

### 2. Efficient Polling
```javascript
// In mobile app: Poll only when app is active
useEffect(() => {
  if (appState === 'active') {
    wifiService.startPolling(5000);
  } else {
    wifiService.stopPolling();
  }
}, [appState]);
```

### 3. Error Handling
```javascript
// Handle connection errors gracefully
try {
  await wifiService.fetchData();
} catch (error) {
  // Fall back to cached data or show warning
  console.warn('Using cached data');
}
```

---

## Security (Optional)

### Add API Key Authentication

**ESP32:**
```cpp
void handleData() {
  String apiKey = server.header("X-API-Key");
  if (apiKey != "your-secret-key") {
    server.send(401, "text/plain", "Unauthorized");
    return;
  }
  // ... rest of code
}
```

**Mobile App:**
```javascript
const response = await fetch(url, {
  headers: {
    'X-API-Key': 'your-secret-key',
  },
});
```

---

## Troubleshooting

### "Connection failed"
1. Check ESP32 is connected to WiFi (Serial Monitor)
2. Ping the ESP32 IP from your phone
3. Ensure phone and ESP32 on same WiFi network
4. Check firewall settings

### "Data not updating"
1. Open browser and test `http://ESP32-IP/data`
2. Check Serial Monitor for errors
3. Verify polling is started
4. Check internet connection

### "Different WiFi networks"
- **Option 1:** ESP32 as Access Point (creates its own WiFi)
- **Option 2:** ESP32 connects to your home WiFi (easier)

---

## Recommendation

**Use WiFi instead of BLE because:**

1. ✅ **Works NOW** - No build process needed
2. ✅ **Faster development** - Test immediately in Expo Go
3. ✅ **Easier debugging** - Use browser to test
4. ✅ **Better range** - Works across your home
5. ✅ **Simpler code** - Just HTTP requests
6. ✅ **More reliable** - Less connection issues

**When to use BLE:**
- When watch needs to be truly portable (away from WiFi)
- When battery life is critical
- When you need sub-second latency

**For a home health tracker, WiFi is perfect!** 🏡

---

**Ready to implement? Let me know and I'll create the full WiFi implementation for you!**

---

**Last Updated**: November 6, 2025
