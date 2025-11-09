/**
 * WiFi Service for ESP32-S3 Smartwatch Integration
 * HTTP-based communication - works with Expo Go!
 * 
 * This service communicates with ESP32 via WiFi using simple HTTP requests.
 * Much simpler than BLE and works immediately without custom builds.
 */

class WiFiService {
  constructor() {
    // Default ESP32 IP (user can change this in Settings)
    this.esp32IP = '192.168.1.100';
    this.esp32Port = 80;
    this.isConnected = false;
    this.pollingInterval = null;
    this.pollingFrequency = 5000; // 5 seconds
    
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
   * Set ESP32 IP address and port
   */
  setESP32Address(ip, port = 80) {
    this.esp32IP = ip;
    this.esp32Port = port;
    console.log(`📡 ESP32 address set to: http://${ip}:${port}`);
  }

  /**
   * Get base URL for ESP32
   */
  getBaseURL() {
    return `http://${this.esp32IP}:${this.esp32Port}`;
  }

  /**
   * Test connection to ESP32
   */
  async testConnection() {
    try {
      console.log(`🔍 Testing connection to ${this.getBaseURL()}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.getBaseURL()}/`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Connection successful!');
        this.isConnected = true;
        this.notifyConnectionChange(true);
        return true;
      } else {
        console.log('❌ Connection failed:', response.status);
        this.isConnected = false;
        this.notifyConnectionChange(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      this.isConnected = false;
      this.notifyConnectionChange(false);
      
      let errorMessage = 'Connection failed. ';
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Check ESP32 IP address and ensure it\'s on the same WiFi network.';
      } else {
        errorMessage += error.message;
      }
      
      this.notifyError(new Error(errorMessage));
      return false;
    }
  }

  /**
   * Fetch data from ESP32
   */
  async fetchData() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.getBaseURL()}/data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update cache with received data
      this.dataCache = {
        steps: data.steps || 0,
        heartRate: data.heartRate || 0,
        battery: data.battery || 100,
        lastUpdate: new Date(),
      };

      // Update connection status
      if (!this.isConnected) {
        this.isConnected = true;
        this.notifyConnectionChange(true);
      }

      // Notify listeners of new data
      this.notifyDataReceived(this.dataCache);
      
      console.log('📊 Data received:', this.dataCache);
      return this.dataCache;
      
    } catch (error) {
      console.error('❌ Fetch data error:', error.message);
      
      // Update connection status
      if (this.isConnected) {
        this.isConnected = false;
        this.notifyConnectionChange(false);
      }
      
      this.notifyError(error);
      throw error;
    }
  }

  /**
   * Start auto-polling for data
   * @param {number} intervalMs - Polling interval in milliseconds (default: 5000)
   */
  startPolling(intervalMs = 5000) {
    // Stop any existing polling
    if (this.pollingInterval) {
      this.stopPolling();
    }

    this.pollingFrequency = intervalMs;
    console.log(`⏰ Starting polling every ${intervalMs}ms`);
    
    // Initial fetch
    this.fetchData().catch(err => {
      console.error('Initial fetch failed:', err);
    });
    
    // Set up interval for continuous polling
    this.pollingInterval = setInterval(() => {
      this.fetchData().catch(err => {
        console.error('Polling fetch failed:', err);
      });
    }, intervalMs);
  }

  /**
   * Stop auto-polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('⏸️ Polling stopped');
    }
  }

  /**
   * Sync current time to ESP32
   */
  async syncTime() {
    try {
      const now = Math.floor(Date.now() / 1000); // Unix timestamp
      
      console.log(`🕐 Syncing time: ${now}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.getBaseURL()}/sync-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `timestamp=${now}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Time synced successfully');
        return true;
      } else {
        console.log('❌ Time sync failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Time sync error:', error.message);
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Send weather data to ESP32
   * @param {number} temperature - Temperature in Celsius
   * @param {number} condition - Weather condition code (0=sunny, 1=cloudy, 2=rainy)
   */
  async sendWeather(temperature, condition) {
    try {
      console.log(`🌤️ Sending weather: ${temperature}°C, condition: ${condition}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.getBaseURL()}/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `temperature=${temperature}&condition=${condition}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ Weather data sent');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Send weather error:', error.message);
      return false;
    }
  }

  /**
   * Get cached data (useful when offline or between polls)
   */
  getCachedData() {
    return { ...this.dataCache };
  }

  /**
   * Check if currently connected
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get current ESP32 address
   */
  getESP32Address() {
    return {
      ip: this.esp32IP,
      port: this.esp32Port,
      url: this.getBaseURL(),
    };
  }

  /**
   * Disconnect from ESP32 (stops polling)
   */
  async disconnect() {
    console.log('🔌 Disconnecting...');
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

  /**
   * Reset service to initial state
   */
  reset() {
    this.stopPolling();
    this.isConnected = false;
    this.dataCache = {
      steps: 0,
      heartRate: 0,
      battery: 100,
      lastUpdate: null,
    };
  }
}

// Export singleton instance
export default new WiFiService();
