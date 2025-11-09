// Firebase disabled for UI testing
// All Firebase imports and initialization are commented out
// npx expo install @react-native-async-storage/async-storage expo-constants

// Dummy exports to prevent import errors - UNCOMMENT WHEN ENABLING FIREBASE
// export const auth = null;
// export const db = null;
// export default null;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Get config from app.config.js extra
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

// Initialise Firebase App
const app = initializeApp(firebaseConfig);

// Initialise Firestore only
const db = getFirestore(app);

export { db };
export default app;
