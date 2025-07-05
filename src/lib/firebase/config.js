// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH5e7UeWC8HYTr-QSykDhyu7cpe-zdWeY",
  authDomain: "cyber-lms.firebaseapp.com",
  projectId: "cyber-lms",
  storageBucket: "cyber-lms.firebasestorage.app",
  messagingSenderId: "564006382100",
  appId: "1:564006382100:web:a34cc4fc380a9e75d39501",
  measurementId: "G-SQ45QM3WZL",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics conditionally (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  // Check if analytics is supported before initializing
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics }; 