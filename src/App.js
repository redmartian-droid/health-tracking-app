/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "./App.css";
import Navigation from "./components/Navbar";
import BottomNavigation from "./components/BottomNavbar";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import HeartRatePage from "./components/HeartRatePage";
import StepsPage from "./components/StepsPage";
import MedicinePage from "./components/MedicinePage";
import MilestonesPage from "./components/MilestonesPage";
import RewardsPage from "./components/RewardPage";
import SettingsPage from "./components/SettingsPage";
import ProfileSelection from "./components/ProfileSelection";
import { API } from "./services/api";

import { LoaderCircle } from "lucide-react";

function App() {
  return (
    <Router>
      <ProfileWrapper />
    </Router>
  );
}

function ProfileWrapper() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add this useEffect to load the existing profile
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

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 text-gray-800">
        <div className="text-center">
          <LoaderCircle className="animate-spin rounded-full h-32 w-32 text-green-500 mx-auto" />
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedProfile) {
    return <ProfileSelection onProfileSelect={handleProfileSelect} />;
  }

  return <HealthTracker selectedProfile={selectedProfile} />;
}

function HealthTracker({ selectedProfile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    checkAdminMode();
  }, [location]);

  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname.slice(1);
    return path || "dashboard";
  };

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

  const fetchData = useCallback(async () => {
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
  }, [selectedProfile.id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const checkAdminMode = async () => {
    try {
      setIsAdminMode(false); // Default to false, can be toggled in settings
    } catch (error) {
      console.error("Error checking admin mode:", error);
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

  // Navigation handler
  const handleNavigation = (page) => {
    navigate(`/${page === "dashboard" ? "" : page}`);
  };

  // Show admin dashboard if admin mode is enabled
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <Navigation
          currentPage={getCurrentPage()}
          setCurrentPage={handleNavigation}
          totalPoints={totalPoints}
          isAdmin={true}
          selectedProfile={selectedProfile}
        />

        <main className="py-6">
          <Routes>
            <Route path="*" element={<AdminDashboard />} />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  selectedProfile={selectedProfile}
                  setIsAdminMode={setIsAdminMode}
                />
              }
            />
          </Routes>
        </main>

        <BottomNavigation
          currentPage={getCurrentPage()}
          setCurrentPage={handleNavigation}
          isAdmin={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pb-16">
      {/* Top Navigation */}
      <Navigation
        currentPage={getCurrentPage()}
        setCurrentPage={handleNavigation}
        totalPoints={totalPoints}
        selectedProfile={selectedProfile}
      />

      {/* Main Content with Routes */}
      <main className="py-6">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                heartRate={heartRate}
                steps={steps}
                medicines={medicines}
                milestones={milestones}
              />
            }
          />
          <Route
            path="/heart"
            element={<HeartRatePage heartRate={heartRate} />}
          />
          <Route path="/steps" element={<StepsPage steps={steps} />} />
          <Route
            path="/medicine"
            element={
              <MedicinePage
                medicines={medicines}
                toggleMedicine={toggleMedicine}
                addMedicine={addMedicine}
              />
            }
          />
          <Route
            path="/milestones"
            element={
              <MilestonesPage
                milestones={milestones}
                totalPoints={totalPoints}
                completeMilestone={completeMilestone}
              />
            }
          />
          <Route
            path="/rewards"
            element={
              <RewardsPage milestones={milestones} totalPoints={totalPoints} />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                selectedProfile={selectedProfile}
                setIsAdminMode={setIsAdminMode}
              />
            }
          />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentPage={getCurrentPage()}
        setCurrentPage={handleNavigation}
      />
    </div>
  );
}

export default App;
