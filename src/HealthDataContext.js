import React, { createContext, useState, useEffect, useContext } from "react";
import { API } from "../services/api";

const HealthDataContext = createContext(null);

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error("useHealthData must be used within a HealthDataProvider");
  }
  return context;
}

export function HealthDataProvider({ children }) {
  const [heartRate, setHeartRate] = useState(0);
  const [steps, setSteps] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hr, st, med, ms, points] = await Promise.all([
          API.getHeartRate(),
          API.getSteps(),
          API.getMedicines(),
          API.getMilestones(),
          API.getTotalPoints(), // Assuming an API endpoint for total points
        ]);
        setHeartRate(hr);
        setSteps(st);
        setMedicines(med);
        setMilestones(ms);
        setTotalPoints(points);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleMedicine = async (medicineId, time) => {
    const medicine = medicines.find((m) => m.id === medicineId);
    if (!medicine) return;

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
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone || milestone.completed) return;

    try {
      await API.completeMilestone(milestoneId);
      setMilestones(
        milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: true } : m
        )
      );
      setTotalPoints((prev) => prev + milestone.reward);
    } catch (error) {
      console.error("Error completing milestone:", error);
    }
  };

  const value = {
    heartRate,
    steps,
    medicines,
    milestones,
    totalPoints,
    toggleMedicine,
    addMedicine,
    completeMilestone,
  };

  return <HealthDataContext.Provider value={value}>{children}</HealthDataContext.Provider>;
}