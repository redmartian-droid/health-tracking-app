# ESP32 BLE Integration - Quick Start Guide

## ⚡ Quick Setup (5 Minutes)

### Prerequisites
- ✅ `react-native-ble-plx` already installed
- ✅ Permissions configured in `app.config.js`
- ✅ BLE service implemented
- ✅ UI ready in Settings page

### For Mobile App Developers

**1. Run the App**
```bash
npm start
# Press 'a' for Android or 'i' for iOS
```

**2. Connect Your Watch**
- Open the app
- Navigate to **Settings** (bottom nav bar)
- Find **ESP32 Smartwatch** section
- Tap **Connect Watch**
- Wait for "Chronos C3" to appear
- Connection successful! ✨

**3. Verify Data Flow**
- Check real-time **Steps** count
- See **Heart Rate** updates
- Monitor **Battery** level
- Tap **Sync Time** to update watch clock

---

### For ESP32 Developers

**1. Upload This Code to ESP32**

Create a new Arduino sketch and paste:

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHAR_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHAR_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLECharacteristic *pTxCharacteristic;
bool connected = false;
int stepCount = 0;

class ServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      connected = true;
      Serial.println("📱 App connected!");
    }
    void onDisconnect(BLEServer* pServer) {
      connected = false;
      Serial.println("📱 App disconnected");
      pServer->startAdvertising();
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Starting BLE Server...");
  
  BLEDevice::init("Chronos C3");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pTxCharacteristic = pService->createCharacteristic(
    CHAR_UUID_TX, BLECharacteristic::PROPERTY_NOTIFY);
  pTxCharacteristic->addDescriptor(new BLE2902());
  
  pService->start();
  pServer->getAdvertising()->start();
  Serial.println("✅ Ready! Waiting for app...");
}

void loop() {
  if (connected) {
    stepCount += random(1, 5); // Simulate steps
    
    // Send steps (packet type 0x01)
    uint8_t data[3] = {0x01, stepCount & 0xFF, (stepCount >> 8) & 0xFF};
    pTxCharacteristic->setValue(data, 3);
    pTxCharacteristic->notify();
    
    Serial.printf("📊 Sent steps: %d\n", stepCount);
    delay(5000); // Every 5 seconds
  }
  delay(100);
}
```

**2. Upload and Monitor**
```
Tools > Board > ESP32S3 Dev Module
Tools > Port > [Your COM Port]
Click Upload
Open Serial Monitor (115200 baud)
```

**3. Test Connection**
- You should see: "✅ Ready! Waiting for app..."
- Connect from mobile app
- Watch Serial Monitor for: "📱 App connected!"
- See steps being sent: "📊 Sent steps: 123"

---

## 🎯 What's Implemented

### Mobile App Features
- ✅ BLE scanning and connection
- ✅ Auto-reconnection (up to 5 attempts)
- ✅ Real-time data updates
- ✅ Graceful fallback to mock data
- ✅ Connection status indicators
- ✅ Error handling and display
- ✅ Time synchronization
- ✅ Weather updates (ready for implementation)
- ✅ Notification support (ready for implementation)

### ESP32 Support
- ✅ Nordic UART Service (NUS) protocol
- ✅ Bidirectional communication
- ✅ Step counter data
- ✅ Heart rate data
- ✅ Battery level data
- ✅ Time sync commands
- ✅ Weather data commands
- ✅ Notification commands

---

## 📱 UI Features

### Settings Page - Watch Section
- **Connection Status**: Green dot = connected, Red dot = disconnected
- **Real-time Data Display**: Steps, Heart Rate, Battery percentage
- **Connect Button**: Initiates BLE scan (15-second timeout)
- **Sync Time Button**: Updates watch clock
- **Disconnect Button**: Safely disconnects watch
- **Error Messages**: Clear feedback for connection issues

---

## 🔧 Customization

### Change Device Name

**Mobile App** (`src/services/bleService.js`):
```javascript
await bleService.scanAndConnect('YOUR_WATCH_NAME', 15000);
```

**ESP32**:
```cpp
BLEDevice::init("YOUR_WATCH_NAME");
```

### Change Scan Timeout

```javascript
// Default: 15 seconds
await bleService.scanAndConnect('Chronos C3', 30000); // 30 seconds
```

### Change Auto-Reconnect Settings

In `src/services/bleService.js`:
```javascript
this.maxReconnectAttempts = 10; // Default: 5
this.reconnectDelay = 5000;     // Default: 3000ms
```

---

## 🐛 Common Issues

### "Device not found"
- ✅ Check watch is powered on
- ✅ Verify device name matches exactly
- ✅ Enable Bluetooth on phone
- ✅ Grant location permission (Android requirement)

### "Connection failed"
- ✅ Restart both devices
- ✅ Forget device in phone Bluetooth settings
- ✅ Check UUIDs match exactly
- ✅ Verify watch is advertising

### No data received
- ✅ Check Serial Monitor for "App connected!"
- ✅ Verify watch is sending notifications
- ✅ Check packet format (3 bytes)
- ✅ Use nRF Connect app to debug

---

## 📊 Data Protocol

### From Watch to App

| Data | Packet Type | Example |
|------|-------------|---------|
| Steps | 0x01 | `[0x01, 0x88, 0x13]` = 5000 steps |
| Heart Rate | 0x02 | `[0x02, 0x48, 0x00]` = 72 BPM |
| Battery | 0x03 | `[0x03, 0x55, 0x00]` = 85% |

### From App to Watch

| Command | Packet Type | Example |
|---------|-------------|---------|
| Sync Time | 0x04 | `[0x04, low, high]` = Unix timestamp |
| Weather | 0x05 | `[0x05, temp, condition]` |
| Notification | 0x06 | `[0x06, type, 0x00]` |

---

## 📚 Full Documentation

For detailed information, see:
- **[ESP32_BLE_INTEGRATION.md](./ESP32_BLE_INTEGRATION.md)** - Complete integration guide
- **src/services/bleService.js** - BLE implementation
- **src/services/api.js** - API integration with fallback

---

## 🚀 Next Steps

1. **Test Basic Connection**
   - Upload simple ESP32 code
   - Connect from mobile app
   - Verify data flow

2. **Integrate Real Sensors**
   - Add QMI8658C IMU for steps
   - Add heart rate sensor (if available)
   - Add battery monitoring

3. **Customize Data**
   - Adjust update frequency
   - Add custom data types
   - Implement weather sync

4. **Optimize**
   - Reduce power consumption
   - Improve reconnection logic
   - Add data validation

---

## ✅ Verification Checklist

Before deploying:

**Mobile App**
- [ ] BLE permissions granted
- [ ] Can scan for devices
- [ ] Successfully connects
- [ ] Receives data correctly
- [ ] Auto-reconnects on disconnect
- [ ] Gracefully handles errors
- [ ] Falls back to mock data when needed

**ESP32 Watch**
- [ ] BLE advertising active
- [ ] Accepts connections
- [ ] Sends data in correct format
- [ ] Receives commands correctly
- [ ] Restarts advertising after disconnect
- [ ] IMU sensor working
- [ ] Battery monitoring functional

---

## 💡 Pro Tips

1. **Use BLE Scanner Apps**
   - nRF Connect (Android)
   - LightBlue Explorer (iOS)
   - Great for debugging

2. **Monitor Serial Output**
   - Always keep Serial Monitor open
   - Add debug prints liberally
   - Check for connection events

3. **Test Reconnection**
   - Turn watch on/off
   - Walk out of range
   - Verify auto-reconnect works

4. **Optimize Battery**
   - Reduce notification frequency
   - Use longer intervals
   - Implement sleep mode

---

## 📞 Support

**Issues?**
1. Check [ESP32_BLE_INTEGRATION.md](./ESP32_BLE_INTEGRATION.md)
2. Review Serial Monitor output
3. Test with BLE scanner app
4. Check ChronosESP32 docs

**Happy Coding! 🎉**

---

**Version**: 1.0.0  
**Last Updated**: November 6, 2025
