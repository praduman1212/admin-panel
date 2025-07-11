import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAH5e7UeWC8HYTr-QSykDhyu7cpe-zdWeY",
  authDomain: "cyber-lms.firebaseapp.com",
  projectId: "cyber-lms",
  storageBucket: "cyber-lms.firebasestorage.app",
  messagingSenderId: "564006382100",
  appId: "1:564006382100:web:a34cc4fc380a9e75d39501",
  measurementId: "G-SQ45QM3WZL",
};

// Initialize Firebase only if it hasn't been initialized
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
    // Dynamically import analytics to avoid SSR issues
    import('firebase/analytics').then(({ getAnalytics }) => {
        analytics = getAnalytics(app);
    }).catch((error) => {
        console.error('Error loading analytics:', error);
    });
}

export { auth, db, storage, analytics };