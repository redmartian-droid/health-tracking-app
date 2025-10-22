import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

const HealthDataContext = createContext();

export function HealthDataProvider({ children }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // listen to a user's document `healthData` (adjust collection/path to your schema)
    const ref = doc(db, "users", user.uid, "meta", "health");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHealthData(data);
          setTotalPoints(data.totalPoints || 0);
        }
      },
      (err) => console.warn("HealthData snapshot error:", err)
    );

    return () => unsub();
  }, []);

  return (
    <HealthDataContext.Provider value={{ totalPoints, healthData, setTotalPoints }}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  return useContext(HealthDataContext);
}