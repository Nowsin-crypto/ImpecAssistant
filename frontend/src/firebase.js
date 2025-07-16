// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCx2t5eAN7weTVzF2Y7Hga1ME2ZJwDJpDE",
  authDomain: "impekassistant.firebaseapp.com",
  projectId: "impekassistant",
  storageBucket: "impekassistant.firebasestorage.app",
  messagingSenderId: "367291865905",
  appId: "1:367291865905:web:49bf08fb8a6ff3d71e2e10",
  measurementId: "G-6RM6QW5PZE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
