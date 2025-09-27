import React, { useState } from "react";
import { User, Bell, Download, Trash2, Save, Shield } from "lucide-react";
// import { auth, db } from "../firebase/config";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Placeholder Profile Information that we'll replace as we start to integrate real data

    name: "John Doe",
    email: "john.doe@example.com",

    // Notifications
    pushNotifications: true,
    emailNotifications: false,
    milestoneAlerts: true,
    weeklyReports: true,
    soundEffects: true,

    // Appearance
    darkMode: false,
    compactMode: false,
    showAnimations: true,

    // Privacy
    shareProgress: false,
    publicProfile: false,
    dataCollection: true,

    // Goals
    dailyTarget: 50,
    weeklyGoal: 300,
    reminderTime: "09:00",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg border p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
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
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="py-3">
      <label className="block font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600">
          Customise your experience and preferences
        </p>
      </div>

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

      {/* Data Management (might include more fields later down the line) */}
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
              This will permanently delete all your progress and rewards
            </p>
          </div>
        </div>
      </SettingSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          style={{ borderBottomColor: " #16A34A" }}
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>

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
                onClick={() => {
                  // Handle delete action here
                  setShowDeleteConfirm(false);
                }}
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
