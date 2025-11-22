import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debugging: Log config presence (do not log actual keys for security)
console.log("Firebase Config Check:", {
    apiKey: firebaseConfig.apiKey ? "Present" : "MISSING",
    projectId: firebaseConfig.projectId ? "Present" : "MISSING",
    authDomain: firebaseConfig.authDomain ? "Present" : "MISSING",
});

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
