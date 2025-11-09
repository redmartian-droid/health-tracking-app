// components/ProfileSelection.js
import React, { useState } from "react";
import { API } from "../services/api";

const defaultProfiles = [
  {
    id: "patient",
    name: "Patient",
    image: "/patient.png",
    description: "Track your health and progress",
    type: "patient",
  },
  {
    id: "caregiver",
    name: "Caregiver",
    image: "/caregiver.png",
    description: "Monitor and support patient care",
    type: "caregiver",
  },
  {
    id: "family",
    name: "Family",
    image: "/family.png",
    description: "Stay connected with loved one's health",
    type: "family",
  },
];

// Same fixed profile IDs for both mobile and desktop (did the same on mobile)
const FIXED_PROFILE_IDS = {
  patient: "patient_profile_001",
  caregiver: "caregiver_profile_001",
  family: "family_profile_001",
};

export default function ProfileSelection({ onProfileSelect }) {
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileSelect = async (profileType) => {
    setLoading(true);
    try {
      const fixedProfileId = FIXED_PROFILE_IDS[profileType];

      // ALWAYS use the fixed profile ID
      let profile = await API.getProfile(fixedProfileId);

      if (!profile) {
        // Profile doesn't exist yet, create it with the fixed ID
        const profileData = defaultProfiles.find((p) => p.id === profileType);
        profile = await API.createProfile({
          id: fixedProfileId, // Use the fixed ID
          name: profileData.name,
          type: profileData.type,
          description: profileData.description,
          image: profileData.image,
          points: 0,
          createdAt: new Date().toISOString(),
        });
        console.log("Created new profile with fixed ID:", fixedProfileId);
      } else {
        console.log("Found existing profile:", profile);
      }

      // Store the profile selection
      localStorage.setItem("currentProfile", JSON.stringify(profile));
      localStorage.setItem("currentProfileType", profileType);

      onProfileSelect(profile);
    } catch (error) {
      console.error("Error selecting profile:", error);
      // Fallback to local profile if Firestore fails
      const profileData = defaultProfiles.find((p) => p.id === profileType);
      const fallbackProfile = {
        id: `local_${profileType}`,
        ...profileData,
        points: 0,
      };
      localStorage.setItem("currentProfile", JSON.stringify(fallbackProfile));
      onProfileSelect(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-6xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-800 mb-3">
            Who's using Medicon?
          </h1>
          <p className="text-gray-600 text-lg">
            Select your profile to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {defaultProfiles.map((profile) => (
            <div
              key={profile.id}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
              className="group relative"
            >
              <div
                className={`relative bg-white rounded-xl p-8 transition-all duration-300 transform shadow-lg border border-gray-200 ${
                  hoveredProfile === profile.id
                    ? "scale-105 shadow-2xl"
                    : "scale-100"
                } ${loading ? "opacity-50" : ""}`}
              >
                <div className="mb-6">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-xl">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  {profile.name}
                </h3>

                <p className="text-gray-600 text-sm mb-6">
                  {profile.description}
                </p>

                <button
                  onClick={() => handleProfileSelect(profile.id)}
                  disabled={loading}
                  className="w-full bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderBottomColor: "#16A34A" }}
                >
                  {loading ? "Loading..." : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Your profile selection helps us personalize your experience
          </p>
          {loading && (
            <p className="text-green-600 text-sm mt-2">
              Setting up your profile...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
