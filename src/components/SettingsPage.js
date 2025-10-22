import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Firebase disabled for UI testing
// import { signOut } from 'firebase/auth';
// import { auth } from '../firebase/config';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
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
    reminderTime: '09:00',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    Alert.alert('Success', 'Settings saved successfully!');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', error.message);
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
        trackColor={{ false: '#d1d5db', true: '#86efac' }}
        thumbColor={checked ? '#22c55e' : '#f3f4f6'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customise your experience and preferences
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
              onChangeText={(value) => updateSetting('name', value)}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={settings.email}
              onChangeText={(value) => updateSetting('email', value)}
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
            onChange={(value) => updateSetting('pushNotifications', value)}
          />
          <ToggleSwitch
            label="Milestone Alerts"
            description="Notify when you reach milestones"
            checked={settings.milestoneAlerts}
            onChange={(value) => updateSetting('milestoneAlerts', value)}
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
            onChange={(value) => updateSetting('dataCollection', value)}
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
              This will permanently delete all your progress and rewards
            </Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="exit" size={24} color="#ef4444" />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSettings}
        >
          <Ionicons name="save" size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

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
              be undone and you will lose all your progress, points, and rewards.
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
                onPress={() => {
                  setShowDeleteConfirm(false);
                  Alert.alert('Deleted', 'All data has been deleted');
                }}
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
    backgroundColor: '#f0fdf4',
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
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  dangerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#dc2626',
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
