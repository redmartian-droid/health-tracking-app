// First, install react-router-dom:
// npm install react-router-dom
// npm install firebase
// npm install react-firebase-hooks

// import necessary modules and components

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// /import { useAuthState } from "react-firebase-hooks/auth";
//import { auth } from "./firebase/config";
//import SignIn from "./components/SignIn";
//import SignUp from "./components/SignUp";

import "./App.css";
import Navigation from "./components/Navbar";
import BottomNavigation from "./components/BottomNavbar";
import Dashboard from "./components/Dashboard";
import HeartRatePage from "./components/HeartRatePage";
import StepsPage from "./components/StepsPage";
import MedicinePage from "./components/MedicinePage";
import MilestonesPage from "./components/MilestonesPage";
import RewardsPage from "./components/RewardPage";
import SettingsPage from "./components/SettingsPage";
import { API } from "./services/api";

// Main App component that handles routing, feel free to adjust as needed (AuthWrapper serves as entry point for auth logic)
function App() {
  return (
    <Router>
      <HealthTracker />
    </Router>
  );
}

// function AuthWrapper() {
// const [user, error] = useAuthState(auth);

//if (error) {
//console.error("Authentication error:", error);
//return (
// <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
// <div className="text-center">
//   <h2 className="text-xl mb-4">Authentication Error</h2>
//   <p>{error.message}</p>
// </div>
// </div>
// );
// }

// If user is not authenticated, show auth routes
//if (!user) {
//   return <AuthRoutes />;
// }

// If user is authenticated, show the health tracker app
//  return <HealthTracker />;
// }

//function AuthRoutes() {
//  return (
//    <div className="min-h-screen bg-gray-900">
//      <Routes>
//        <Route path="/signup" element={<SignUp />} />
//        <Route path="*" element={<SignIn />} />
//      </Routes>
//    </div>
//  );
//}

function HealthTracker() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname.slice(1); // This removes the leading slash, dynamic routing is a bit weird
    return path || "dashboard"; // Defaults to dashboard
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [hr, st, med, ms] = await Promise.all([
        API.getHeartRate(),
        API.getSteps(),
        API.getMedicines(),
        API.getMilestones(),
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
      await API.updateMedicine(medicineId, time, newTaken);
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
      const medicine = await API.addMedicine({
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
      await API.completeMilestone(milestoneId);
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

  return (
    <div className="min-h-screen bg-green-50 pb-16">
      {/* Top Navigation */}
      <Navigation
        currentPage={getCurrentPage()}
        setCurrentPage={handleNavigation}
        totalPoints={totalPoints}
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
          <Route path="/settings" element={<SettingsPage />} />
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
