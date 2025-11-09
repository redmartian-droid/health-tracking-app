// components/ProfileSelector.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../services/api";

const defaultProfiles = [
  {
    id: "patient",
    name: "Patient",
    image: require("../../public/patient.png"),
    type: "patient",
  },
  {
    id: "caregiver",
    name: "Caregiver",
    image: require("../../public/caregiver.png"),
    type: "caregiver",
  },
  {
    id: "family",
    name: "Family",
    image: require("../../public/family.png"),
    type: "family",
  },
];

const FIXED_PROFILE_IDS = {
  patient: "patient_profile_001",
  caregiver: "caregiver_profile_001",
  family: "family_profile_001",
};

export default function ProfileSelector({ onProfileSelect }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearOldProfileData();
  }, []);

  const clearOldProfileData = async () => {
    try {
      await AsyncStorage.removeItem("currentProfile");
      console.log("Cleared old profile data");
    } catch (error) {
      console.log("Error clearing old profile data:", error);
    }
  };

  const handleProfileSelect = async (profileType) => {
    setLoading(true);
    try {
      const fixedProfileId = FIXED_PROFILE_IDS[profileType];
      console.log("Mobile: Attempting to load profile:", fixedProfileId);

      let profile = await API.getProfile(fixedProfileId);
      console.log("Mobile: Profile fetch result:", profile);

      if (!profile) {
        console.log("Mobile: Profile doesn't exist, creating it...");
        const profileData = defaultProfiles.find((p) => p.id === profileType);
        profile = await API.createProfile({
          id: fixedProfileId,
          name: profileData.name,
          type: profileData.type,
          image: profileData.image,
          points: 0,
          createdAt: new Date().toISOString(),
        });
        console.log("Mobile: Created new profile:", profile);
      } else {
        console.log("Mobile: Found existing profile:", profile);
      }

      await AsyncStorage.setItem("currentProfile", JSON.stringify(profile));
      await AsyncStorage.setItem("currentProfileType", profileType);

      console.log("Mobile: Profile selected and stored:", profile);
      onProfileSelect(profile);
    } catch (error) {
      console.error("Mobile: Error selecting profile:", error);
      Alert.alert("Error", "Failed to load profile. Using offline mode.");

      const profileData = defaultProfiles.find((p) => p.id === profileType);
      const fallbackProfile = {
        id: `local_${profileType}`,
        ...profileData,
        points: 0,
      };
      await AsyncStorage.setItem(
        "currentProfile",
        JSON.stringify(fallbackProfile)
      );
      onProfileSelect(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Who's using Medicon?</Text>

      <View style={styles.profilesContainer}>
        {defaultProfiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={styles.profileButton}
            onPress={() => handleProfileSelect(profile.id)}
          >
            <Image source={profile.image} style={styles.profileImage} />
            <Text style={styles.profileName}>{profile.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingVertical: 40,
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
    color: "#374151",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 70,
    textAlign: "center",
  },
  profilesContainer: {
    width: "100%",
    alignItems: "center",
  },
  profileButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#22c55e",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#166534",
  },
});
