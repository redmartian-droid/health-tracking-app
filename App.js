import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import SplashScreen from "./src/components/SplashScreenNative";
import ProfileSelection from "./src/components/ProfileSelector";
import Dashboard from "./src/components/Dashboard";
import HeartRatePage from "./src/components/HeartRatePage";
import StepsPage from "./src/components/StepsPage";
import MedicinePage from "./src/components/MedicinePage";
import MilestonesPage from "./src/components/MilestonesPage";
import RewardsPage from "./src/components/RewardPage";
import SettingsPage from "./src/components/SettingsPage";
import { API } from "./src/services/api";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount, try to load existing profile
  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      // Try to load last used profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem("currentProfile");
      console.log("Stored profile found:", storedProfile);

      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setSelectedProfile(profile);
        console.log("Loaded existing profile:", profile);
      }
    } catch (error) {
      console.log("No existing profile found or error loading:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  // ADD THIS FUNCTION - Handle profile switching
  const handleProfileSwitch = () => {
    setSelectedProfile(null); // This will trigger profile selection screen
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show profile selection if no profile is selected
  if (!selectedProfile) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileSelection">
            {(props) => (
              <ProfileSelection
                {...props}
                onProfileSelect={handleProfileSelect}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <HealthTrackerTabs
        selectedProfile={selectedProfile}
        onProfileSwitch={handleProfileSwitch} // PASS THE CALLBACK
      />
    </NavigationContainer>
  );
}

function HealthTrackerTabs({ selectedProfile, onProfileSwitch }) {
  // ADD onProfileSwitch PROP
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(5420);
  const [medicines, setMedicines] = useState([]);
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "First 5K Steps",
      target: 5000,
      current: 5420,
      completed: true,
      type: "steps",
      reward: 50,
    },
    {
      id: 2,
      title: "Healthy Heart Week",
      target: 7,
      current: 6,
      completed: false,
      type: "heart",
      reward: 100,
    },
    {
      id: 3,
      title: "Medicine Compliance",
      target: 14,
      current: 12,
      completed: false,
      type: "medicine",
      reward: 75,
    },
    {
      id: 4,
      title: "10K Steps Champion",
      target: 10000,
      current: 5420,
      completed: false,
      type: "steps",
      reward: 150,
    },
  ]);
  const [totalPoints, setTotalPoints] = useState(250);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedProfile.id]);

  const fetchData = async () => {
    try {
      const [hr, st, med, ms] = await Promise.all([
        API.getHeartRate(),
        API.getSteps(),
        API.getMedicines(selectedProfile.id),
        API.getMilestones(selectedProfile.id),
      ]);
      setHeartRate(hr);
      setSteps(st);
      setMedicines(med);
      setMilestones(ms);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleMedicine = async (medicineId, time) => {
    const medicine = medicines.find((m) => m.id === medicineId);
    const newTaken = !medicine.taken[time];

    try {
      await API.updateMedicine(selectedProfile.id, medicineId, time, newTaken);
      setMedicines(
        medicines.map((m) =>
          m.id === medicineId
            ? { ...m, taken: { ...m.taken, [time]: newTaken } }
            : m
        )
      );

      if (newTaken) {
        setTotalPoints((prev) => prev + 10);
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const addMedicine = async (newMed) => {
    try {
      const medicine = await API.addMedicine(selectedProfile.id, {
        ...newMed,
        taken: newMed.times.reduce(
          (acc, time) => ({ ...acc, [time]: false }),
          {}
        ),
      });
      setMedicines([...medicines, medicine]);
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  const completeMilestone = async (milestoneId) => {
    try {
      await API.completeMilestone(selectedProfile.id, milestoneId);
      setMilestones(
        milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: true } : m
        )
      );

      const milestone = milestones.find((m) => m.id === milestoneId);
      setTotalPoints((prev) => prev + milestone.reward);
    } catch (error) {
      console.error("Error completing milestone:", error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Heart") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Steps") {
            iconName = focused ? "footsteps" : "footsteps-outline";
          } else if (route.name === "Medicine") {
            iconName = focused ? "medical" : "medical-outline";
          } else if (route.name === "Milestones") {
            iconName = focused ? "trophy" : "trophy-outline";
          } else if (route.name === "Rewards") {
            iconName = focused ? "gift" : "gift-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "gray",
        headerStyle: {
          backgroundColor: "#22c55e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => (
          <Dashboard
            {...props}
            heartRate={heartRate}
            steps={steps}
            medicines={medicines}
            milestones={milestones}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Heart">
        {(props) => <HeartRatePage {...props} heartRate={heartRate} />}
      </Tab.Screen>
      <Tab.Screen name="Steps">
        {(props) => <StepsPage {...props} steps={steps} />}
      </Tab.Screen>
      <Tab.Screen name="Medicine">
        {(props) => (
          <MedicinePage
            {...props}
            medicines={medicines}
            toggleMedicine={toggleMedicine}
            addMedicine={addMedicine}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Milestones">
        {(props) => (
          <MilestonesPage
            {...props}
            milestones={milestones}
            totalPoints={totalPoints}
            completeMilestone={completeMilestone}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Rewards">
        {(props) => (
          <RewardsPage
            {...props}
            milestones={milestones}
            totalPoints={totalPoints}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => (
          <SettingsPage
            {...props}
            selectedProfile={selectedProfile}
            onProfileSwitch={onProfileSwitch} // PASS IT TO SETTINGS PAGE
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#374151",
  },
});

export default App;
