// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjb9xH7_x6AgRNXVGV2hcjuEpNsk-kYao",
  authDomain: "library-management-17ede.firebaseapp.com",
  projectId: "library-management-17ede",
  storageBucket: "library-management-17ede.firebasestorage.app",
  messagingSenderId: "606785276940",
  appId: "1:606785276940:web:707533b023560f5145f229",
  measurementId: "G-6FYQG5R5Q3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
