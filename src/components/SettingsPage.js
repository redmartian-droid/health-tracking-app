import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Download,
  Trash2,
  Save,
  Shield,
  LogOut,
} from "lucide-react";

export default function SettingsPage({ selectedProfile, setIsAdminMode }) {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setMessage("Error loading settings");
      setLoading(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const SettingSection = ({ title, children }) => (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({
    label,
    description,
    checked,
    onChange,
    disabled,
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const InputField = ({ label, type, value, onChange, placeholder }) => (
    <div className="py-3">
      <label className="block font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      // Simulate saving (replace with your API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update admin mode in parent if provided
      if (setIsAdminMode) {
        setIsAdminMode(settings.adminMode);
      }

      setMessage("Settings saved successfully!");

      setTimeout(() => {
        setMessage("");
        // Reload app so App.js picks up adminMode immediately
        window.location.reload();
      }, 1200);

      setSaving(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Error saving settings: " + error.message);
      setSaving(false);
    }
  };

  const deleteAllData = async () => {
    try {
      // Simulate data deletion (replace with your API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowDeleteConfirm(false);
      setMessage("All data deleted successfully");

      // Reload page after deletion
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error deleting data:", error);
      setMessage("Error deleting data: " + error.message);
    }
  };

  const switchProfile = () => {
    // Clear the current profile from localStorage
    const profileTypes = ["patient", "caregiver", "family"];
    profileTypes.forEach((type) => {
      localStorage.removeItem(`medicon_${type}_profile_id`);
    });

    // Clear any current profile selection
    localStorage.removeItem("currentProfile");

    // Reload the app to show profile selection
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600">
          Customise your experience and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Current Profile Info */}
      <SettingSection title="Current Profile">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-800">
                {selectedProfile?.name}
              </h4>
              <p className="text-sm text-blue-600">
                {selectedProfile?.description}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Profile Type: {selectedProfile?.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">
                Points: {selectedProfile?.points || 0}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSwitchProfileConfirm(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium w-full justify-center py-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Switch Profile
        </button>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Switch to a different profile type (Patient, Caregiver, or Family)
        </p>
      </SettingSection>

      {/* Admin Mode Toggle - no additional security for the time being */}
      <SettingSection title="Admin Settings">
        <div className="bg-green-100 p-6 rounded-lg border border-green-300">
          <ToggleSwitch
            label="Admin Dashboard Mode"
            description="Switch to admin dashboard to view all user data and analytics"
            checked={settings.adminMode}
            onChange={(value) => {
              console.log("Toggling adminMode:", value);
              updateSetting("adminMode", value);
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            Note: This mode allows you to see system-wide statistics and user
            data
          </p>
        </div>
      </SettingSection>

      {/* Profile Settings */}
      <SettingSection title="Profile" icon={User}>
        <InputField
          label="Display Name"
          type="text"
          value={settings.name}
          onChange={(value) => updateSetting("name", value)}
          placeholder="Enter your name"
        />
        <InputField
          label="Email Address"
          type="email"
          value={settings.email}
          onChange={(value) => updateSetting("email", value)}
          placeholder="Enter your email"
        />
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection title="Notifications" icon={Bell}>
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
      </SettingSection>

      {/* Privacy Settings */}
      <SettingSection title="Privacy & Security" icon={Shield}>
        <ToggleSwitch
          label="Analytics & Usage Data"
          description="Help improve the app by sharing anonymous usage data"
          checked={settings.dataCollection}
          onChange={(value) => updateSetting("dataCollection", value)}
        />
      </SettingSection>

      {/* Data Management */}
      <SettingSection title="Data Management" icon={Download}>
        <div className="space-y-4">
          <div className="pt-4 border-t">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Data
            </button>
            <p className="text-sm text-gray-600 mt-1">
              This will permanently delete all your progress and rewards for
              this profile
            </p>
          </div>
        </div>
      </SettingSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`bg-green-500 border-b-4 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ borderBottomColor: "#16A34A" }}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Switch Profile Confirmation Modal */}
      {showSwitchProfileConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold">Switch Profile</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to switch profiles? Your current progress
              will be saved, and you can return to this profile anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSwitchProfileConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={switchProfile}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Switch Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold">Delete All Data</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all your data? This action cannot
              be undone and you will lose all your progress, points, and
              rewards.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAllData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
