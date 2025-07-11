// the firebase given configuration (using it to save the conversation history for the human support to view later)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//directly copied from the given config, keeping this comments
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCx2t5eAN7weTVzF2Y7Hga1ME2ZJwDJpDE",
  authDomain: "impekassistant.firebaseapp.com",
  projectId: "impekassistant",
  storageBucket: "impekassistant.firebasestorage.app",
  messagingSenderId: "367291865905",
  appId: "1:367291865905:web:49bf08fb8a6ff3d71e2e10",
  measurementId: "G-6RM6QW5PZE"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };