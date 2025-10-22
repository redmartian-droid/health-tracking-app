// Firebase disabled for UI testing
// All Firebase imports and initialization are commented out

// Dummy exports to prevent import errors
export const auth = null;
export const db = null;
export default null;

/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'YOUR_API_KEY_HERE',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN_HERE',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID_HERE',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET_HERE',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID_HERE',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'YOUR_APP_ID_HERE',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
*/
