import React, { useState, useEffect } from "react";
import Navigation from "./components/Navbar";
import BottomNavigation from "./components/BottomNavbar";
import Dashboard from "./components/Dashboard";
import HeartRatePage from "./components/HeartRatePage";
import StepsPage from "./components/StepsPage";
import MedicinePage from "./components/MedicinePage";
import MilestonesPage from "./components/MilestonesPage";
import RewardsPage from "./components/RewardPage";
import { API } from "./services/api";

export default function HealthTracker() {
  const [currentPage, setCurrentPage] = useState("dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Navigation */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPoints={totalPoints}
      />

      {/* Main Content */}
      <main className="py-6">
        {currentPage === "dashboard" && (
          <Dashboard
            heartRate={heartRate}
            steps={steps}
            medicines={medicines}
            milestones={milestones}
          />
        )}

        {currentPage === "heart" && <HeartRatePage heartRate={heartRate} />}

        {currentPage === "steps" && <StepsPage steps={steps} />}

        {currentPage === "medicine" && (
          <MedicinePage
            medicines={medicines}
            toggleMedicine={toggleMedicine}
            addMedicine={addMedicine}
          />
        )}

        {currentPage === "milestones" && (
          <MilestonesPage
            milestones={milestones}
            totalPoints={totalPoints}
            completeMilestone={completeMilestone}
          />
        )}

        {currentPage === "rewards" && (
          <RewardsPage milestones={milestones} totalPoints={totalPoints} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

// This is the main entry point for the Health Tracker web application
// It initializes the app, sets up state management, and handles data fetching
// It also manages navigation between different "pages" of the app, for now its not actually separate pages
// The app includes features for tracking heart rate, steps, medicines, milestones, and rewards
// NB: I couldn't seperate the components into different pages yet
