# ESP32-S3 Smartwatch BLE Integration Guide

## Overview

This guide explains how to integrate your ESP32-S3 smartwatch with the Health Tracking mobile app via Bluetooth Low Energy (BLE).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture](#architecture)
3. [BLE Protocol](#ble-protocol)
4. [Mobile App Setup](#mobile-app-setup)
5. [ESP32 Watch Setup](#esp32-watch-setup)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Mobile App
- React Native/Expo development environment
- Android device (Android 6.0+) or iOS device (iOS 11+)
- `react-native-ble-plx` library (already installed)

### ESP32 Watch
- ESP32-S3 board with QMI8658C IMU sensor
- ChronosESP32 library installed
- Arduino IDE or PlatformIO
- BLE enabled firmware

---

## Architecture

### Communication Flow

```
┌─────────────────┐          BLE          ┌─────────────────┐
│                 │   ◄────────────►       │                 │
│   Mobile App    │   Notifications        │  ESP32 Watch    │
│  (React Native) │   Commands             │  (Arduino)      │
│                 │                        │                 │
└─────────────────┘                        └─────────────────┘
       │                                            │
       │                                            │
       ▼                                            ▼
   Firebase                                    QMI8658C
   Cloud Storage                               IMU Sensor
```

### Data Flow
1. **Watch → App**: Steps, Heart Rate, Battery Level
2. **App → Watch**: Time Sync, Weather, Notifications

---

## BLE Protocol

### Service & Characteristics

The integration uses the **Nordic UART Service (NUS)** protocol:

| Component | UUID |
|-----------|------|
| **Service UUID** | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` |
| **TX Characteristic** (App → Watch) | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` |
| **RX Characteristic** (Watch → App) | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` |

### Data Packet Format

All data packets follow this 3-byte structure:

```
┌──────────────┬─────────────┬──────────────┐
│  Packet Type │  Value Low  │  Value High  │
│   (1 byte)   │  (1 byte)   │  (1 byte)    │
└──────────────┴─────────────┴──────────────┘
```

**Example**: Steps count of 5000
- Packet Type: `0x01` (STEPS)
- Value Low: `0x88` (5000 & 0xFF = 136)
- Value High: `0x13` ((5000 >> 8) & 0xFF = 19)

### Packet Types

| Type | Hex | Name | Direction | Description |
|------|-----|------|-----------|-------------|
| 1 | 0x01 | STEPS | Watch → App | Step count |
| 2 | 0x02 | HEART_RATE | Watch → App | Heart rate (BPM) |
| 3 | 0x03 | BATTERY | Watch → App | Battery level (0-100%) |
| 4 | 0x04 | TIME_SYNC | App → Watch | Unix timestamp |
| 5 | 0x05 | WEATHER | App → Watch | Temperature & condition |
| 6 | 0x06 | NOTIFICATION | App → Watch | Notification type |

---

## Mobile App Setup

### 1. Install Dependencies

The BLE library is already installed, but if you need to reinstall:

```bash
npm install react-native-ble-plx
```

### 2. Configure Permissions

Permissions have been added to `app.config.js`:

#### Android
- `BLUETOOTH`
- `BLUETOOTH_ADMIN`
- `BLUETOOTH_CONNECT` (Android 12+)
- `BLUETOOTH_SCAN` (Android 12+)
- `ACCESS_FINE_LOCATION`

#### iOS
- `NSBluetoothAlwaysUsageDescription`
- `NSBluetoothPeripheralUsageDescription`

### 3. Project Structure

```
src/
├── services/
│   ├── bleService.js       # BLE communication layer
│   └── api.js              # Updated with BLE integration
├── components/
│   └── SettingsPage.js     # Watch connection UI
```

### 4. Usage in App

#### Connect to Watch

```javascript
import bleService from './src/services/bleService';

// Initialize BLE
await bleService.initialize();

// Scan and connect
await bleService.scanAndConnect('Chronos C3', 15000);
```

#### Listen for Data

```javascript
bleService.addEventListener('onDataReceived', (data) => {
  console.log('Steps:', data.steps);
  console.log('Heart Rate:', data.heartRate);
  console.log('Battery:', data.battery);
});
```

#### Send Data to Watch

```javascript
// Sync time
await bleService.syncTime();

// Send weather (temperature: 25°C, condition: sunny)
await bleService.sendWeather(25, 1);

// Send notification
await bleService.sendNotification(1);
```

---

## ESP32 Watch Setup

### 1. Required Libraries

Install these libraries in Arduino IDE:

```
- ChronosESP32 (by fbiego)
- ESP32 BLE Arduino
- QMI8658C (IMU sensor library)
```

### 2. Basic BLE Server Code

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUIDs
#define SERVICE_UUID        "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

BLECharacteristic *pTxCharacteristic;
bool deviceConnected = false;

// Packet types
#define PACKET_STEPS 0x01
#define PACKET_HEART_RATE 0x02
#define PACKET_BATTERY 0x03
#define PACKET_TIME_SYNC 0x04

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Device connected");
    }

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Device disconnected");
      pServer->startAdvertising(); // Restart advertising
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();

      if (rxValue.length() > 0) {
        uint8_t packetType = rxValue[0];
        uint16_t value = rxValue[1] | (rxValue[2] << 8);
        
        handleCommand(packetType, value);
      }
    }
};

void handleCommand(uint8_t type, uint16_t value) {
  switch(type) {
    case PACKET_TIME_SYNC:
      // Update RTC with timestamp
      Serial.printf("Time sync: %d\n", value);
      break;
    case PACKET_STEPS:
      // Request to send steps
      sendSteps();
      break;
    case PACKET_HEART_RATE:
      // Request to send heart rate
      sendHeartRate();
      break;
    case PACKET_BATTERY:
      // Request to send battery
      sendBattery();
      break;
  }
}

void sendSteps() {
  if (deviceConnected) {
    uint16_t steps = getStepCount(); // Your function
    uint8_t data[3] = {PACKET_STEPS, steps & 0xFF, (steps >> 8) & 0xFF};
    pTxCharacteristic->setValue(data, 3);
    pTxCharacteristic->notify();
  }
}

void sendHeartRate() {
  if (deviceConnected) {
    uint16_t hr = getHeartRate(); // Your function
    uint8_t data[3] = {PACKET_HEART_RATE, hr & 0xFF, (hr >> 8) & 0xFF};
    pTxCharacteristic->setValue(data, 3);
    pTxCharacteristic->notify();
  }
}

void sendBattery() {
  if (deviceConnected) {
    uint16_t battery = getBatteryLevel(); // Your function
    uint8_t data[3] = {PACKET_BATTERY, battery & 0xFF, (battery >> 8) & 0xFF};
    pTxCharacteristic->setValue(data, 3);
    pTxCharacteristic->notify();
  }
}

void setup() {
  Serial.begin(115200);
  
  // Initialize BLE
  BLEDevice::init("Chronos C3"); // Device name
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create TX Characteristic (notify)
  pTxCharacteristic = pService->createCharacteristic(
                        CHARACTERISTIC_UUID_TX,
                        BLECharacteristic::PROPERTY_NOTIFY
                      );
  pTxCharacteristic->addDescriptor(new BLE2902());

  // Create RX Characteristic (write)
  BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(
                                           CHARACTERISTIC_UUID_RX,
                                           BLECharacteristic::PROPERTY_WRITE
                                         );
  pRxCharacteristic->setCallbacks(new MyCallbacks());

  // Start service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();
  Serial.println("Waiting for connection...");
}

void loop() {
  // Periodically send data when connected
  if (deviceConnected) {
    static unsigned long lastSend = 0;
    if (millis() - lastSend > 5000) { // Every 5 seconds
      sendSteps();
      delay(100);
      sendHeartRate();
      delay(100);
      sendBattery();
      lastSend = millis();
    }
  }
  delay(10);
}
```

### 3. ChronosESP32 Integration

If using ChronosESP32 library:

```cpp
#include <Chronos.h>

Chronos watch("Chronos C3");

void setup() {
  watch.begin();
  watch.setBLE(true);
  // ChronosESP32 handles BLE automatically
}

void loop() {
  watch.loop();
}
```

---

## Testing

### Test Checklist

#### Mobile App
- [ ] BLE permissions granted
- [ ] Bluetooth enabled
- [ ] App can scan for devices
- [ ] Connection established
- [ ] Data received from watch
- [ ] Commands sent to watch
- [ ] Auto-reconnection works

#### ESP32 Watch
- [ ] BLE advertising active
- [ ] Device name correct ("Chronos C3")
- [ ] Connection accepted
- [ ] Data sent on request
- [ ] Commands received and processed
- [ ] Notifications working

### Testing Steps

1. **Setup**
   ```bash
   # Start the mobile app
   npm start
   # Choose Android or iOS
   ```

2. **Connect Watch**
   - Open **Settings** in the app
   - Find **ESP32 Smartwatch** section
   - Tap **Connect Watch**
   - Wait for "Chronos C3" to be found
   - Connection should succeed

3. **Verify Data Flow**
   - Check **Steps**, **Heart Rate**, **Battery** display
   - Values should update every few seconds
   - Tap **Sync Time** to test commands

4. **Test Reconnection**
   - Turn off watch Bluetooth
   - App should show "Disconnected"
   - Turn on watch Bluetooth
   - App should auto-reconnect (within 15 seconds)

---

## Troubleshooting

### Mobile App Issues

#### "Bluetooth permissions not granted"
**Solution**: 
- Android: Go to Settings → Apps → Health Tracker → Permissions
- Enable Location (required for BLE on Android)
- Enable Bluetooth (Android 12+)

#### "Device not found"
**Solutions**:
1. Check watch is powered on
2. Verify watch name is "Chronos C3"
3. Check watch is advertising
4. Try restarting both devices
5. Reduce distance between devices

#### "Connection failed"
**Solutions**:
1. Forget device in phone Bluetooth settings
2. Restart BLE on watch
3. Check UUID matches exactly
4. Verify service is started on watch

#### No data received
**Solutions**:
1. Check TX characteristic notifications enabled
2. Verify packet format matches protocol
3. Check watch is actually sending data
4. Use BLE scanner app to verify watch is transmitting

### ESP32 Watch Issues

#### BLE not advertising
**Solutions**:
1. Check `BLEDevice::init()` called
2. Verify `startAdvertising()` called
3. Check Serial output for errors
4. Restart ESP32

#### Data not sending
**Solutions**:
1. Verify `deviceConnected` is true
2. Check `notify()` is called after `setValue()`
3. Verify TX characteristic properties include NOTIFY
4. Check data format (3 bytes)

#### Commands not received
**Solutions**:
1. Verify RX characteristic properties include WRITE
2. Check `onWrite()` callback is registered
3. Add Serial.println() to debug received data
4. Verify packet parsing logic

### Debug Tools

#### BLE Scanner Apps
- **Android**: nRF Connect
- **iOS**: LightBlue Explorer

Use these to:
- Verify watch is advertising
- Check service/characteristic UUIDs
- Test notifications manually
- Debug connection issues

#### Console Logs

**Mobile App**:
```javascript
// Enable detailed BLE logs
bleService.manager.setLogLevel('Verbose');
```

**ESP32**:
```cpp
// Add debug output
Serial.printf("Sending packet: Type=%d, Value=%d\n", type, value);
```

---

## Advanced Features

### Auto-Reconnection

The app automatically attempts reconnection:
- Max attempts: 5
- Delay between attempts: 3 seconds
- Triggered on disconnect

### Data Caching

Data is cached for 30 seconds:
- Reduces BLE traffic
- Provides fallback if watch disconnects
- Falls back to mock data if needed

### Battery Optimization

Tips for better battery life:
- Reduce notification frequency
- Increase data send interval
- Use connection parameters optimization
- Implement sleep mode on watch

---

## API Reference

### BLE Service Methods

```javascript
// Initialize
await bleService.initialize()

// Scan and connect
await bleService.scanAndConnect(deviceName, timeout)

// Disconnect
await bleService.disconnect()

// Request data
await bleService.requestSteps()
await bleService.requestHeartRate()
await bleService.requestBattery()

// Send data
await bleService.syncTime()
await bleService.sendWeather(temp, condition)
await bleService.sendNotification(type)

// Get cached data
const data = bleService.getCachedData()

// Event listeners
bleService.addEventListener('onConnectionChange', callback)
bleService.addEventListener('onDataReceived', callback)
bleService.addEventListener('onError', callback)
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Test with BLE scanner app
4. Check ChronosESP32 documentation: https://github.com/fbiego/ChronosESP32

---

## License

This integration follows the same license as the main project.

---

**Last Updated**: November 6, 2025
**Version**: 1.0.0
