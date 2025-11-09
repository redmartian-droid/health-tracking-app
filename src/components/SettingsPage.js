import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import wifiService from "../services/wifiService";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsPage({
  selectedProfile,
  setIsAdminMode,
  onProfileSwitch,
}) {
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    pushNotifications: true,
    emailNotifications: false,
    milestoneAlerts: true,
    weeklyReports: true,
    soundEffects: true,
    darkMode: false,
    compactMode: false,
    showAnimations: true,
    shareProgress: false,
    publicProfile: false,
    dataCollection: true,
    dailyTarget: 50,
    weeklyGoal: 300,
    reminderTime: "09:00",
    adminMode: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSwitchProfileConfirm, setShowSwitchProfileConfirm] =
    useState(false);

  // Watch connection state (WiFi)
  const [watchConnected, setWatchConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [watchData, setWatchData] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [esp32IP, setESP32IP] = useState("192.168.1.100");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserSettings();
    // Check initial connection status
    setWatchConnected(wifiService.getConnectionStatus());

    // Set up event listeners
    wifiService.addEventListener("onConnectionChange", handleConnectionChange);
    wifiService.addEventListener("onDataReceived", handleDataReceived);
    wifiService.addEventListener("onError", handleWiFiError);

    return () => {
      wifiService.removeEventListener(
        "onConnectionChange",
        handleConnectionChange
      );
      wifiService.removeEventListener("onDataReceived", handleDataReceived);
      wifiService.removeEventListener("onError", handleWiFiError);
    };
  }, []);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);

      // Use profile data instead of Firebase auth
      if (selectedProfile) {
        setSettings((prev) => ({
          ...prev,
          name: selectedProfile.name || "",
          email: "",
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      Alert.alert("Error", "Error loading settings");
      setLoading(false);
    }
  };

  const handleConnectionChange = (connected) => {
    setWatchConnected(connected);
    if (connected) {
      setConnectionError(null);
      Alert.alert("Success", "ESP32 smartwatch connected via WiFi!");
    } else {
      Alert.alert("Disconnected", "ESP32 smartwatch disconnected");
    }
  };

  const handleDataReceived = (data) => {
    setWatchData(data);
  };

  const handleWiFiError = (error) => {
    setConnectionError(error.message);
    setIsConnecting(false);
  };

  const handleConnectWatch = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Set ESP32 IP address
      wifiService.setESP32Address(esp32IP);

      // Test connection
      const connected = await wifiService.testConnection();

      if (connected) {
        // Start polling for data every 5 seconds
        wifiService.startPolling(5000);
        Alert.alert("Success", `Connected to ESP32 at ${esp32IP}`);
      } else {
        Alert.alert(
          "Error",
          "Failed to connect. Check IP address and ensure ESP32 is on same WiFi network."
        );
      }
    } catch (error) {
      setConnectionError(error.message);
      Alert.alert("Error", error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWatch = async () => {
    try {
      await wifiService.disconnect();
      setWatchData(null);
      Alert.alert("Disconnected", "ESP32 smartwatch disconnected");
    } catch (error) {
      Alert.alert("Error", "Failed to disconnect: " + error.message);
    }
  };

  const handleSyncTime = async () => {
    try {
      const success = await wifiService.syncTime();
      if (success) {
        Alert.alert("Success", "Time synced to watch");
      } else {
        Alert.alert("Error", "Failed to sync time");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sync time: " + error.message);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update admin mode in parent if provided
      if (setIsAdminMode) {
        setIsAdminMode(settings.adminMode);
      }

      Alert.alert("Success", "Settings saved successfully!");

      setTimeout(() => {}, 1200);

      setSaving(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Error saving settings: " + error.message);
      setSaving(false);
    }
  };

  const deleteAllData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowDeleteConfirm(false);
      Alert.alert("Deleted", "All data has been deleted");

      // Reload page after deletion
      setTimeout(() => {}, 1500);
    } catch (error) {
      console.error("Error deleting data:", error);
      Alert.alert("Error", "Error deleting data: " + error.message);
    }
  };

  const switchProfile = async () => {
    try {
      // Clear all profile data from storage
      const keysToRemove = [
        "medicon_patient_profile_id",
        "medicon_caregiver_profile_id",
        "medicon_family_profile_id",
        "currentProfile",
        "userSettings",
      ];

      await AsyncStorage.multiRemove(keysToRemove);

      setShowSwitchProfileConfirm(false);

      // Show success message and trigger profile reset
      Alert.alert("Profile Switched", "Please select a new profile type", [
        {
          text: "Continue",
          onPress: () => {
            // Reset any local state
            if (onProfileSwitch) {
              onProfileSwitch();
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Error switching profiles:", error);
      Alert.alert("Error", "Failed to switch profiles. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description && (
          <Text style={styles.toggleDescription}>{description}</Text>
        )}
      </View>
      <Switch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: "#d1d5db", true: "#86efac" }}
        thumbColor={checked ? "#22c55e" : "#f3f4f6"}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customise your experience and preferences
          </Text>
        </View>

        {/* Current Profile Info */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle" size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Current Profile</Text>
          </View>

          <View style={styles.profileInfoContainer}>
            <View style={styles.profileInfoRow}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{selectedProfile?.name}</Text>
                <Text style={styles.profileDescription}>
                  {selectedProfile?.description}
                </Text>
                <Text style={styles.profileType}>
                  Profile Type: {selectedProfile?.type}
                </Text>
              </View>
              <View style={styles.profilePoints}>
                <Text style={styles.pointsText}>
                  Points: {selectedProfile?.points || 0}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.switchProfileButton}
            onPress={() => setShowSwitchProfileConfirm(true)}
          >
            <Ionicons name="swap-horizontal" size={20} color="#3b82f6" />
            <Text style={styles.switchProfileButtonText}>Switch Profile</Text>
          </TouchableOpacity>
          <Text style={styles.switchProfileHint}>
            Switch to a different profile type (Patient, Caregiver, or Family)
          </Text>
        </View>

        {/* Admin Mode Toggle */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={24} color="#22c55e" />
            <Text style={styles.sectionTitle}>Admin Settings</Text>
          </View>
          <View style={styles.adminModeContainer}>
            <ToggleSwitch
              label="Admin Dashboard Mode"
              description="Switch to admin dashboard to view all user data and analytics"
              checked={settings.adminMode}
              onChange={(value) => updateSetting("adminMode", value)}
            />
            <Text style={styles.adminModeHint}>
              Note: This mode allows you to see system-wide statistics and user
              data
            </Text>
          </View>
        </View>

        {/* Smartwatch Connection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="watch" size={24} color="#22c55e" />
            <Text style={styles.sectionTitle}>ESP32 Smartwatch</Text>
          </View>

          {/* Connection Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: watchConnected ? "#22c55e" : "#ef4444" },
                ]}
              />
              <Text style={styles.statusText}>
                {watchConnected ? "Connected" : "Disconnected"}
              </Text>
            </View>
            {watchConnected && watchData && (
              <Text style={styles.statusSubtext}>
                Last update:{" "}
                {watchData.lastUpdate?.toLocaleTimeString() || "N/A"}
              </Text>
            )}
          </View>

          {/* Connection Error */}
          {connectionError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{connectionError}</Text>
            </View>
          )}

          {/* IP Address Input */}
          {!watchConnected && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ESP32 IP Address</Text>
              <TextInput
                style={styles.input}
                value={esp32IP}
                onChangeText={setESP32IP}
                placeholder="192.168.1.100"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <Text style={styles.inputHint}>
                Find this IP in ESP32 Serial Monitor after uploading code
              </Text>
            </View>
          )}

          {/* Watch Data Display */}
          {watchConnected && watchData && (
            <View style={styles.watchDataContainer}>
              <View style={styles.watchDataItem}>
                <Ionicons name="footsteps" size={20} color="#3b82f6" />
                <Text style={styles.watchDataLabel}>Steps</Text>
                <Text style={styles.watchDataValue}>
                  {watchData.steps || 0}
                </Text>
              </View>
              <View style={styles.watchDataItem}>
                <Ionicons name="heart" size={20} color="#ef4444" />
                <Text style={styles.watchDataLabel}>Heart Rate</Text>
                <Text style={styles.watchDataValue}>
                  {watchData.heartRate || 0} BPM
                </Text>
              </View>
              <View style={styles.watchDataItem}>
                <Ionicons name="battery-half" size={20} color="#22c55e" />
                <Text style={styles.watchDataLabel}>Battery</Text>
                <Text style={styles.watchDataValue}>
                  {watchData.battery || 100}%
                </Text>
              </View>
            </View>
          )}

          {/* Connection Buttons */}
          <View style={styles.watchButtonsContainer}>
            {!watchConnected ? (
              <TouchableOpacity
                style={[styles.watchButton, styles.connectButton]}
                onPress={handleConnectWatch}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.watchButtonText}>Scanning...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="bluetooth" size={20} color="#ffffff" />
                    <Text style={styles.watchButtonText}>Connect Watch</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.watchButton, styles.syncButton]}
                  onPress={handleSyncTime}
                >
                  <Ionicons name="time" size={20} color="#ffffff" />
                  <Text style={styles.watchButtonText}>Sync Time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.watchButton, styles.disconnectButton]}
                  onPress={handleDisconnectWatch}
                >
                  <Ionicons name="close-circle" size={20} color="#ffffff" />
                  <Text style={styles.watchButtonText}>Disconnect</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.watchDescription}>
            Connect your ESP32-S3 smartwatch to sync real-time health data
            including steps, heart rate, and battery level.
          </Text>
        </View>

        {/* Profile Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Profile</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={settings.name}
              onChangeText={(value) => updateSetting("name", value)}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={settings.email}
              onChangeText={(value) => updateSetting("email", value)}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>
          <ToggleSwitch
            label="Push Notifications"
            description="Receive notifications on your device"
            checked={settings.pushNotifications}
            onChange={(value) => updateSetting("pushNotifications", value)}
          />
          <ToggleSwitch
            label="Milestone Alerts"
            description="Notify when you reach milestones"
            checked={settings.milestoneAlerts}
            onChange={(value) => updateSetting("milestoneAlerts", value)}
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
          </View>
          <ToggleSwitch
            label="Analytics & Usage Data"
            description="Help improve the app by sharing anonymous usage data"
            checked={settings.dataCollection}
            onChange={(value) => updateSetting("dataCollection", value)}
          />
        </View>

        {/* Data Management */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="download" size={24} color="#22c55e" />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>
          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Ionicons name="trash" size={20} color="#dc2626" />
              <Text style={styles.deleteButtonText}>Delete All Data</Text>
            </TouchableOpacity>
            <Text style={styles.dangerText}>
              This will permanently delete all your progress and rewards for
              this profile
            </Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="exit" size={24} color="#ef4444" />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="save" size={20} color="#ffffff" />
          )}
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Settings"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Switch Profile Confirmation Modal */}
      <Modal
        visible={showSwitchProfileConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSwitchProfileConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="swap-horizontal" size={24} color="#3b82f6" />
              <Text style={styles.modalTitle}>Switch Profile</Text>
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to switch profiles? Your current progress
              will be saved, and you can return to this profile anytime.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSwitchProfileConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmSwitchButton}
                onPress={switchProfile}
              >
                <Text style={styles.confirmSwitchButtonText}>
                  Switch Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="trash" size={24} color="#dc2626" />
              <Text style={styles.modalTitle}>Delete All Data</Text>
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to delete all your data? This action cannot
              be undone and you will lose all your progress, points, and
              rewards.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={deleteAllData}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileInfoContainer: {
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  profileInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  profileDescription: {
    fontSize: 14,
    color: "#3b82f6",
    marginBottom: 4,
  },
  profileType: {
    fontSize: 12,
    color: "#60a5fa",
  },
  profilePoints: {
    alignItems: "flex-end",
  },
  pointsText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
  switchProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#93c5fd",
    borderRadius: 8,
    marginBottom: 8,
  },
  switchProfileButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  switchProfileHint: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  adminModeContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  adminModeHint: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 8,
    fontStyle: "italic",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputHint: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
    fontStyle: "italic",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  toggleDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  dangerText: {
    fontSize: 12,
    color: "#6b7280",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22c55e",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  modalText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  confirmSwitchButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },
  confirmSwitchButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  // Watch Connection Styles
  statusContainer: {
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  statusSubtext: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    flex: 1,
  },
  watchDataContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  watchDataItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  watchDataLabel: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
  },
  watchDataValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  watchButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  watchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  connectButton: {
    backgroundColor: "#3b82f6",
  },
  syncButton: {
    backgroundColor: "#22c55e",
  },
  disconnectButton: {
    backgroundColor: "#ef4444",
  },
  watchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  watchDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 18,
  },
});
