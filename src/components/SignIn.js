import React, { useState } from "react";

const profiles = [
  {
    id: "patient",
    name: "Patient",
    image: "/patient.png",
    description: "Track your health and progress",
  },
  {
    id: "caregiver",
    name: "Caregiver",
    image: "/caregiver.png",
    description: "Monitor and support patient care",
  },
  {
    id: "family",
    name: "Family",
    image: "/family.png",
    description: "Stay connected with loved one's health",
  },
];

export default function ProfileSelection({ onProfileSelect }) {
  const [hoveredProfile, setHoveredProfile] = useState(null);

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
          {profiles.map((profile) => (
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
                }`}
              >
                {/* Profile Image Container */}
                <div className="mb-6">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-xl">
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image doesn't load
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%2316A34A' width='160' height='160'/%3E%3Ctext x='50%25' y='50%25' font-size='64' text-anchor='middle' dy='.3em' fill='white'%3E" +
                          profile.name[0] +
                          "%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                </div>

                {/* Profile Name */}
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  {profile.name}
                </h3>

                {/* Profile Description */}
                <p className="text-gray-600 text-sm mb-6">
                  {profile.description}
                </p>

                {/* Select Button */}
                <button
                  onClick={() => onProfileSelect(profile)}
                  className="w-full bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  style={{ borderBottomColor: "#16A34A" }}
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Your profile selection helps us personalise your experience
          </p>
        </div>
      </div>
    </div>
  );
}
