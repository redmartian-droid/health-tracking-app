import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const extras =
  (Constants && (Constants.expoConfig?.extra || Constants.manifest?.extra)) || {};

const firebaseConfig = {
  apiKey: extras.firebaseApiKey || process.env.FIREBASE_API_KEY || "",
  authDomain: extras.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: extras.firebaseProjectId || process.env.FIREBASE_PROJECT_ID || "",
  storageBucket:
    extras.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    extras.firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: extras.firebaseAppId || process.env.FIREBASE_APP_ID || "",
};

// Optional: warn if config looks empty
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    "Firebase config missing keys. Fill extras in app.json (expo.extra) or set env vars."
  );
}

// Initialize app only once (prevents duplicate init on Fast Refresh)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
