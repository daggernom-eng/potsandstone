import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCjvAUnr9GczTcoUJ5LHW2j0wYY4yWDQTc",
  authDomain: "ivary-cafe.firebaseapp.com",
  projectId: "ivary-cafe",
  storageBucket: "ivary-cafe.firebasestorage.app",
  messagingSenderId: "405806026913",
  appId: "1:405806026913:web:c7273c964ae408204ba0e0",
  measurementId: "G-JY2PPE7W6N"
};

// Initialize Firebase app singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics client-side initialization
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
