import { db, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp, // Undefined value were due to missing import
  deleteDoc, // Undefined value were due to missing import
} from "firebase/firestore";

export const API = {
  // These would still be mock functions for now until we plug in the arduino or ESP32 data
  getHeartRate: () => Promise.resolve(Math.floor(Math.random() * 40) + 60),
  getSteps: () => Promise.resolve(Math.floor(Math.random() * 8000) + 2000),

  // Fetch medicines from Firestore and handle adding/updating for medicines
  getMedicines: async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const q = query(
        collection(db, "medicines"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting medicines:", error);
      return [];
    }
  },

  updateMedicine: async (medicineId, time, taken) => {
    try {
      const medicineRef = doc(db, "medicines", medicineId);
      await updateDoc(medicineRef, {
        [`taken.${time}`]: taken,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  },

  addMedicine: async (medicine) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const medicineData = {
        ...medicine,
        userId,
        createdAt: serverTimestamp(), // Undefined value, investigate why
      };

      const docRef = await addDoc(collection(db, "medicines"), medicineData);
      return { id: docRef.id, ...medicineData };
    } catch (error) {
      console.error("Error adding medicine:", error);
      throw error;
    }
  },

  deleteMedicine: async (medicineId) => {
    try {
      await deleteDoc(doc(db, "medicines", medicineId)); // Undefined value, investigate why
      return true;
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  },

  // Fetch milestones from Firestore and handle adding/updating for milestones
  getMilestones: async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const q = query(
        collection(db, "milestones"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.isEmpty) {
        return await API.createDefaultMilestones();
      }

      // If no milestones exist, create default ones
      if (snapshot.isEmpty) {
        return await API.createDefaultMilestones();
      }

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting milestones:", error);
      return [];
    }
  },

  createDefaultMilestones: async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");
      // Mock data in case user is not signed in and also for testing. NB: remember to come up with a better default milestone strategy once we have real users
      const defaultMilestones = [
        // We can add default milestones here, some example ones have already been added to firestore. There is a slight lag between the default amount in the website and the amount retrieved. Find fix if possible or force longer loading state.
      ];

      const createdMilestones = [];
      for (const milestone of defaultMilestones) {
        const docRef = await addDoc(collection(db, "milestones"), milestone);
        createdMilestones.push({ id: docRef.id, ...milestone });
      }

      return createdMilestones;
    } catch (error) {
      console.error("Error creating default milestones:", error);
      return [];
    }
  },

  updateMilestone: async (milestoneId, updates) => {
    try {
      const milestoneRef = doc(db, "milestones", milestoneId);
      await updateDoc(milestoneRef, {
        ...updates,
        updatedAt: serverTimestamp(), // Undefined value, investigate why
      });
      return true;
    } catch (error) {
      console.error("Error updating milestone:", error);
      throw error;
    }
  },

  addMilestone: async (milestone) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const milestoneData = {
        ...milestone,
        userId,
        createdAt: serverTimestamp(), // Undefined value, investigate why
      };

      const docRef = await addDoc(collection(db, "milestones"), milestoneData);
      return { id: docRef.id, ...milestoneData };
    } catch (error) {
      console.error("Error adding milestone:", error);
      throw error;
    }
  },

  completeMilestone: async (milestoneId) => {
    try {
      const milestoneRef = doc(db, "milestones", milestoneId);
      await updateDoc(milestoneRef, {
        completed: true,
        completedAt: serverTimestamp(), // Undefined value, investigate why
        updatedAt: serverTimestamp(), // Undefined value, investigate why
      });
      return true;
    } catch (error) {
      console.error("Error completing milestone:", error);
      throw error;
    }
  },

  deleteMilestone: async (milestoneId) => {
    try {
      await deleteDoc(doc(db, "milestones", milestoneId)); // Undefined value, investigate why
      return true;
    } catch (error) {
      console.error("Error deleting milestone:", error);
      throw error;
    }
  },
};
