import { db, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import wifiService from "./wifiService";

export const API = {
  // Health data functions with WiFi integration
  getHeartRate: async () => {
    try {
      // Try to get data from WiFi watch first
      if (wifiService.getConnectionStatus()) {
        const cachedData = wifiService.getCachedData();
        
        // Return WiFi data if available and recent (within last 30 seconds)
        if (cachedData.heartRate > 0 && cachedData.lastUpdate) {
          const timeDiff = Date.now() - cachedData.lastUpdate.getTime();
          if (timeDiff < 30000) {
            return cachedData.heartRate;
          }
        }
      }
    } catch (error) {
      console.error('WiFi heart rate error:', error);
    }
    
    // Fallback to mock data if watch not connected or no data available
    return Promise.resolve(Math.floor(Math.random() * 40) + 60);
  },

  getSteps: async () => {
    try {
      // Try to get data from WiFi watch first
      if (wifiService.getConnectionStatus()) {
        const cachedData = wifiService.getCachedData();
        
        // Return WiFi data if available and recent (within last 30 seconds)
        if (cachedData.steps >= 0 && cachedData.lastUpdate) {
          const timeDiff = Date.now() - cachedData.lastUpdate.getTime();
          if (timeDiff < 30000) {
            return cachedData.steps;
          }
        }
      }
    } catch (error) {
      console.error('WiFi steps error:', error);
    }
    
    // Fallback to mock data if watch not connected or no data available
    return Promise.resolve(Math.floor(Math.random() * 8000) + 2000);
  },

  // Get battery level from watch
  getBattery: async () => {
    try {
      if (wifiService.getConnectionStatus()) {
        const cachedData = wifiService.getCachedData();
        
        if (cachedData.battery > 0 && cachedData.lastUpdate) {
          const timeDiff = Date.now() - cachedData.lastUpdate.getTime();
          if (timeDiff < 60000) { // 1 minute cache
            return cachedData.battery;
          }
        }
      }
    } catch (error) {
      console.error('WiFi battery error:', error);
    }
    
    // Fallback
    return 100;
  },

  // Get all cached watch data at once
  getWatchData: () => {
    if (wifiService.getConnectionStatus()) {
      return wifiService.getCachedData();
    }
    return null;
  },

  // Check if watch is connected
  isWatchConnected: () => {
    return wifiService.getConnectionStatus();
  },

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
        createdAt: serverTimestamp(),
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
      await deleteDoc(doc(db, "medicines", medicineId));
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

      const defaultMilestones = [
        // Default milestones can be added here if needed
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
        updatedAt: serverTimestamp(),
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
        createdAt: serverTimestamp(),
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
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error completing milestone:", error);
      throw error;
    }
  },

  deleteMilestone: async (milestoneId) => {
    try {
      await deleteDoc(doc(db, "milestones", milestoneId));
      return true;
    } catch (error) {
      console.error("Error deleting milestone:", error);
      throw error;
    }
  },
};
