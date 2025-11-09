// services/api.js
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

export const API = {
  // Profile Management

  createProfile: async (profileData) => {
    try {
      const profileWithTimestamp = {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // If profileData has an id, use it as the document ID
      if (profileData.id) {
        const profileRef = doc(db, "profiles", profileData.id);
        await setDoc(profileRef, profileWithTimestamp);
        return { id: profileData.id, ...profileWithTimestamp };
      } else {
        // Otherwise let Firestore generate an ID
        const docRef = await addDoc(
          collection(db, "profiles"),
          profileWithTimestamp
        );
        return { id: docRef.id, ...profileWithTimestamp };
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  getProfile: async (profileId) => {
    try {
      const docSnap = await getDoc(doc(db, "profiles", profileId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  updateProfile: async (profileId, updates) => {
    try {
      const profileRef = doc(db, "profiles", profileId);
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  deleteProfile: async (profileId) => {
    try {
      // First, delete all associated data
      await API.deleteAllProfileData(profileId);

      // Then delete the profile
      await deleteDoc(doc(db, "profiles", profileId));
      return true;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  },

  deleteAllProfileData: async (profileId) => {
    try {
      // Delete all medicines for this profile
      const medicinesQuery = query(
        collection(db, "medicines"),
        where("profileId", "==", profileId)
      );
      const medicinesSnapshot = await getDocs(medicinesQuery);
      const medicineDeletes = medicinesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      // Delete all milestones for this profile
      const milestonesQuery = query(
        collection(db, "milestones"),
        where("profileId", "==", profileId)
      );
      const milestonesSnapshot = await getDocs(milestonesQuery);
      const milestoneDeletes = milestonesSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all([...medicineDeletes, ...milestoneDeletes]);
      return true;
    } catch (error) {
      console.error("Error deleting profile data:", error);
      throw error;
    }
  },

  // Mock sensor data functions
  getHeartRate: () => Promise.resolve(Math.floor(Math.random() * 40) + 60),
  getSteps: () => Promise.resolve(Math.floor(Math.random() * 8000) + 2000),

  // Medicine Management
  getMedicines: async (profileId) => {
    try {
      const q = query(
        collection(db, "medicines"),
        where("profileId", "==", profileId)
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

  updateMedicine: async (profileId, medicineId, time, taken) => {
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

  addMedicine: async (profileId, medicine) => {
    try {
      const medicineData = {
        ...medicine,
        profileId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "medicines"), medicineData);
      return { id: docRef.id, ...medicineData };
    } catch (error) {
      console.error("Error adding medicine:", error);
      throw error;
    }
  },

  deleteMedicine: async (profileId, medicineId) => {
    try {
      await deleteDoc(doc(db, "medicines", medicineId));
      return true;
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  },

  // Milestone Management
  getMilestones: async (profileId) => {
    try {
      const q = query(
        collection(db, "milestones"),
        where("profileId", "==", profileId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return await API.createDefaultMilestones(profileId);
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

  createDefaultMilestones: async (profileId) => {
    try {
      const defaultMilestones = [
        {
          title: "First 5K Steps",
          description: "Walk 5,000 steps in a day",
          target: 5000,
          current: 0,
          completed: false,
          type: "steps",
          reward: 50,
          profileId: profileId,
        },
        {
          title: "Healthy Heart Week",
          description: "Maintain healthy heart rate for 7 days",
          target: 7,
          current: 0,
          completed: false,
          type: "heart",
          reward: 100,
          profileId: profileId,
        },
        {
          title: "Medicine Compliance",
          description: "Take all medicines on time for 14 days",
          target: 14,
          current: 0,
          completed: false,
          type: "medicine",
          reward: 75,
          profileId: profileId,
        },
        {
          title: "10K Steps Champion",
          description: "Walk 10,000 steps in a day",
          target: 10000,
          current: 0,
          completed: false,
          type: "steps",
          reward: 150,
          profileId: profileId,
        },
      ];

      const createdMilestones = [];
      for (const milestone of defaultMilestones) {
        const milestoneData = {
          ...milestone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
          collection(db, "milestones"),
          milestoneData
        );
        createdMilestones.push({ id: docRef.id, ...milestoneData });
      }

      return createdMilestones;
    } catch (error) {
      console.error("Error creating default milestones:", error);
      return [];
    }
  },

  updateMilestone: async (profileId, milestoneId, updates) => {
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

  addMilestone: async (profileId, milestone) => {
    try {
      const milestoneData = {
        ...milestone,
        profileId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "milestones"), milestoneData);
      return { id: docRef.id, ...milestoneData };
    } catch (error) {
      console.error("Error adding milestone:", error);
      throw error;
    }
  },

  completeMilestone: async (profileId, milestoneId) => {
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

  deleteMilestone: async (profileId, milestoneId) => {
    try {
      await deleteDoc(doc(db, "milestones", milestoneId));
      return true;
    } catch (error) {
      console.error("Error deleting milestone:", error);
      throw error;
    }
  },
};
