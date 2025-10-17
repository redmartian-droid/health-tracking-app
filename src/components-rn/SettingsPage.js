import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [biometrics, setBiometrics] = React.useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#6b7280" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#d1d5db" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Icon name="person" size={40} color="#10b981" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={20} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Health Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Settings</Text>
        
        <SettingItem
          icon="favorite"
          title="Heart Rate Goals"
          subtitle="Set your target heart rate zones"
          onPress={() => console.log('Heart rate goals')}
        />
        
        <SettingItem
          icon="directions-walk"
          title="Step Goals"
          subtitle="Daily step target: 10,000 steps"
          onPress={() => console.log('Step goals')}
        />
        
        <SettingItem
          icon="schedule"
          title="Medicine Reminders"
          subtitle="Manage medication schedules"
          onPress={() => console.log('Medicine reminders')}
        />
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Push notifications and reminders"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#f3f4f6', true: '#d1fae5' }}
              thumbColor={notifications ? '#10b981' : '#9ca3af'}
            />
          }
        />
        
        <SettingItem
          icon="dark-mode"
          title="Dark Mode"
          subtitle="Switch to dark theme"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#f3f4f6', true: '#d1fae5' }}
              thumbColor={darkMode ? '#10b981' : '#9ca3af'}
            />
          }
        />
        
        <SettingItem
          icon="fingerprint"
          title="Biometric Login"
          subtitle="Use fingerprint or face ID"
          rightComponent={
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: '#f3f4f6', true: '#d1fae5' }}
              thumbColor={biometrics ? '#10b981' : '#9ca3af'}
            />
          }
        />
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        
        <SettingItem
          icon="cloud-sync"
          title="Data Sync"
          subtitle="Sync data across devices"
          onPress={() => console.log('Data sync')}
        />
        
        <SettingItem
          icon="download"
          title="Export Data"
          subtitle="Download your health data"
          onPress={() => console.log('Export data')}
        />
        
        <SettingItem
          icon="privacy-tip"
          title="Privacy Policy"
          subtitle="View our privacy policy"
          onPress={() => console.log('Privacy policy')}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingItem
          icon="help"
          title="Help Center"
          subtitle="Get help and support"
          onPress={() => console.log('Help center')}
        />
        
        <SettingItem
          icon="feedback"
          title="Send Feedback"
          subtitle="Share your thoughts with us"
          onPress={() => console.log('Send feedback')}
        />
        
        <SettingItem
          icon="info"
          title="About"
          subtitle="App version 1.0.0"
          onPress={() => console.log('About')}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Icon name="logout" size={24} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Health Tracker v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
