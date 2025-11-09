import { Platform, PermissionsAndroid } from 'react-native';

/**
 * BLE Service for ESP32-S3 Smartwatch Integration
 * 
 * Based on ChronosESP32 library UUIDs:
 * - Main Service UUID: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E (Nordic UART Service)
 * - TX Characteristic: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E (Write)
 * - RX Characteristic: 6E400003-B5A3-F393-E0A9-E50E24DCCA9E (Notify)
 * 
 * NOTE: BLE requires a custom development build with Expo.
 * This service will gracefully handle when BLE is not available (e.g., in Expo Go).
 */

// ChronosESP32 BLE UUIDs (Nordic UART Service)
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const TX_CHARACTERISTIC_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E'; // Write to watch
const RX_CHARACTERISTIC_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E'; // Read from watch

// Data packet types
const PACKET_TYPES = {
  STEPS: 0x01,
  HEART_RATE: 0x02,
  BATTERY: 0x03,
  TIME_SYNC: 0x04,
  WEATHER: 0x05,
  NOTIFICATION: 0x06,
};

// Check if BLE is available (won't work in Expo Go)
let BleManager = null;
let isBLEAvailable = false;

try {
  const BLE = require('react-native-ble-plx');
  BleManager = BLE.BleManager;
  isBLEAvailable = true;
  console.log('✅ BLE module loaded successfully');
} catch (error) {
  console.warn('⚠️ BLE not available - using mock mode. To use BLE, create a custom development build with: npx expo prebuild');
  isBLEAvailable = false;
}

class BLEService {
  constructor() {
    this.manager = null;
    this.device = null;
    this.isConnected = false;
    this.isScanning = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isBLEAvailable = isBLEAvailable;
    
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

    // Initialize BLE manager if available
    if (isBLEAvailable && BleManager) {
      try {
        this.manager = new BleManager();
      } catch (error) {
        console.error('Failed to initialize BLE Manager:', error);
        this.isBLEAvailable = false;
      }
    }
  }

  /**
   * Check if BLE is available
   */
  checkAvailability() {
    if (!this.isBLEAvailable) {
      const error = new Error(
        'BLE not available. To use Bluetooth features:\n\n' +
        '1. Run: npx expo prebuild\n' +
        '2. Run: npx expo run:android (or run:ios)\n\n' +
        'BLE cannot work in Expo Go.'
      );
      this.notifyError(error);
      return false;
    }
    return true;
  }

  /**
   * Initialize BLE and request permissions
   */
  async initialize() {
    if (!this.checkAvailability()) {
      return false;
    }

    try {
      if (Platform.OS === 'android') {
        const granted = await this.requestAndroidPermissions();
        if (!granted) {
          throw new Error('Bluetooth permissions not granted');
        }
      }

      const state = await this.manager.state();
      if (state !== 'PoweredOn') {
        throw new Error('Bluetooth is not enabled');
      }

      return true;
    } catch (error) {
      console.error('BLE initialization error:', error);
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Request Android Bluetooth permissions
   */
  async requestAndroidPermissions() {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  /**
   * Scan for ESP32 watch
   * @param {string} deviceName - Name of the device to search for (default: "Chronos C3")
   * @param {number} timeout - Scan timeout in ms
   */
  async scanAndConnect(deviceName = 'Chronos C3', timeout = 10000) {
    if (!this.checkAvailability()) {
      throw new Error('BLE not available');
    }

    if (this.isScanning) {
      console.log('Already scanning');
      return;
    }

    try {
      this.isScanning = true;
      console.log(`Scanning for ${deviceName}...`);

      const devices = [];
      
      // Start scanning
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          this.isScanning = false;
          this.notifyError(error);
          return;
        }

        // Check if device name matches
        if (device && device.name && device.name.includes(deviceName)) {
          console.log('Found device:', device.name, device.id);
          devices.push(device);
          
          // Stop scanning and connect
          this.manager.stopDeviceScan();
          this.isScanning = false;
          this.connectToDevice(device);
        }
      });

      // Stop scanning after timeout
      setTimeout(() => {
        if (this.isScanning) {
          this.manager.stopDeviceScan();
          this.isScanning = false;
          
          if (devices.length === 0) {
            const error = new Error(`Device "${deviceName}" not found`);
            this.notifyError(error);
          }
        }
      }, timeout);

    } catch (error) {
      this.isScanning = false;
      console.error('Scan error:', error);
      this.notifyError(error);
    }
  }

  /**
   * Connect to a BLE device
   */
  async connectToDevice(device) {
    try {
      console.log('Connecting to device:', device.name);

      // Connect to device
      this.device = await device.connect();
      console.log('Connected to:', device.name);

      // Discover services and characteristics
      await this.device.discoverAllServicesAndCharacteristics();
      console.log('Services discovered');

      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);

      // Set up disconnect monitoring
      this.device.onDisconnected((error, device) => {
        console.log('Device disconnected');
        this.handleDisconnection(error);
      });

      // Set up notifications for receiving data
      await this.setupNotifications();

      // Send initial time sync
      await this.syncTime();

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      this.isConnected = false;
      this.notifyConnectionChange(false);
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Setup notifications to receive data from watch
   */
  async setupNotifications() {
    try {
      await this.device.monitorCharacteristicForService(
        SERVICE_UUID,
        RX_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Notification error:', error);
            return;
          }

          if (characteristic && characteristic.value) {
            this.handleReceivedData(characteristic.value);
          }
        }
      );
      console.log('Notifications setup complete');
    } catch (error) {
      console.error('Setup notifications error:', error);
    }
  }

  /**
   * Handle received data from watch
   */
  handleReceivedData(base64Data) {
    try {
      // Decode base64 data
      const data = atob(base64Data);
      const bytes = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        bytes[i] = data.charCodeAt(i);
      }

      // Parse data packet
      if (bytes.length < 2) return;

      const packetType = bytes[0];
      const value = bytes[1] | (bytes[2] << 8); // 16-bit value

      switch (packetType) {
        case PACKET_TYPES.STEPS:
          this.dataCache.steps = value;
          console.log('Steps received:', value);
          break;
        case PACKET_TYPES.HEART_RATE:
          this.dataCache.heartRate = value;
          console.log('Heart rate received:', value);
          break;
        case PACKET_TYPES.BATTERY:
          this.dataCache.battery = value;
          console.log('Battery received:', value);
          break;
      }

      this.dataCache.lastUpdate = new Date();
      this.notifyDataReceived(this.dataCache);

    } catch (error) {
      console.error('Data parsing error:', error);
    }
  }

  /**
   * Write data to watch
   */
  async writeData(packetType, value) {
    if (!this.isConnected || !this.device) {
      console.error('Device not connected');
      return false;
    }

    try {
      // Create data packet [type, valueLow, valueHigh]
      const data = new Uint8Array(3);
      data[0] = packetType;
      data[1] = value & 0xFF;
      data[2] = (value >> 8) & 0xFF;

      // Convert to base64
      const base64Data = btoa(String.fromCharCode.apply(null, data));

      await this.device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        TX_CHARACTERISTIC_UUID,
        base64Data
      );

      return true;
    } catch (error) {
      console.error('Write error:', error);
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Sync current time to watch
   */
  async syncTime() {
    const now = new Date();
    const unixTime = Math.floor(now.getTime() / 1000);
    // Send Unix timestamp (will need to be split into multiple packets for full value)
    return await this.writeData(PACKET_TYPES.TIME_SYNC, unixTime & 0xFFFF);
  }

  /**
   * Send weather data to watch
   */
  async sendWeather(temperature, condition) {
    // Encode temperature and condition into a single packet
    const data = (temperature & 0xFF) | ((condition & 0xFF) << 8);
    return await this.writeData(PACKET_TYPES.WEATHER, data);
  }

  /**
   * Send notification to watch
   */
  async sendNotification(notificationType) {
    return await this.writeData(PACKET_TYPES.NOTIFICATION, notificationType);
  }

  /**
   * Request data from watch
   */
  async requestSteps() {
    return await this.writeData(PACKET_TYPES.STEPS, 0);
  }

  async requestHeartRate() {
    return await this.writeData(PACKET_TYPES.HEART_RATE, 0);
  }

  async requestBattery() {
    return await this.writeData(PACKET_TYPES.BATTERY, 0);
  }

  /**
   * Get cached data
   */
  getCachedData() {
    return { ...this.dataCache };
  }

  /**
   * Handle disconnection and attempt reconnection
   */
  async handleDisconnection(error) {
    this.isConnected = false;
    this.notifyConnectionChange(false);

    if (error) {
      console.error('Disconnection error:', error);
    }

    // Attempt reconnection
    if (this.device && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(async () => {
        try {
          await this.connectToDevice(this.device);
        } catch (error) {
          console.error('Reconnection failed:', error);
        }
      }, this.reconnectDelay);
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect() {
    try {
      if (this.device) {
        await this.device.cancelConnection();
        this.device = null;
      }
      this.isConnected = false;
      this.notifyConnectionChange(false);
      console.log('Disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
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

  /**
   * Cleanup
   */
  async destroy() {
    await this.disconnect();
    if (this.manager) {
      this.manager.destroy();
    }
  }
}

// Export singleton instance
export default new BLEService();
