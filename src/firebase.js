import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzoEka6PiO3oHybO-ex-dbyDIiWSE8LNM",
  authDomain: "thai-military-online.firebaseapp.com",
  projectId: "thai-military-online",
  storageBucket: "thai-military-online.firebasestorage.app",
  messagingSenderId: "7571375758",
  appId: "1:7571375758:web:601c22762f539942c0abdf",
  measurementId: "G-LQQ76QPKP1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);