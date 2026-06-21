/* Firebase Configuration */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKNsrCoCs9QMNYjkI67sr2kVTlutUtto8",
    authDomain: "vijayadurga-aquafoods.firebaseapp.com",
    projectId: "vijayadurga-aquafoods",
    storageBucket: "vijayadurga-aquafoods.firebasestorage.app",
    messagingSenderId: "1078952131449",
    appId: "1:1078952131449:web:9080866fa97a4216bfcda8",
    measurementId: "G-08LPF2JQK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export modules for use in other files
export {
    auth,
    db,
    googleProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
    doc,
    setDoc,
    getDoc,
    updateDoc
};
