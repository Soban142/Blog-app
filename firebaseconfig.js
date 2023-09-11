import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getFirestore, addDoc, collection, setDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCBcVaY4seo_LCjdM_gIm9_PrWF1rrHS-8",
    authDomain: "smit-hackathon-79385.firebaseapp.com",
    projectId: "smit-hackathon-79385",
    storageBucket: "smit-hackathon-79385.appspot.com",
    messagingSenderId: "1031612054630",
    appId: "1:1031612054630:web:bce79983d0df48702fc1a7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
    
export {
    auth,
    app,
    db,
    storage,
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    query,
    where,
    getDocs,
    onAuthStateChanged,
    signOut, 
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
};