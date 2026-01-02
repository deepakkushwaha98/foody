// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "foody-ac13e.firebaseapp.com",
  projectId: "foody-ac13e",
  storageBucket: "foody-ac13e.appspot.com",
  messagingSenderId: "963298822058",
  appId: "1:963298822058:web:4dffa120941adb5c808dd3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
