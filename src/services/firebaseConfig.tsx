import { initializeApp } from 'firebase/app';
import { getFirestore, query, where, getDocs, collection, deleteDoc, doc, addDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyBA5Y8cl4_IKNXEcR0dPqNSg2LPbFcuQq8",
  authDomain: "materialidad-municipal.firebaseapp.com",
  projectId: "materialidad-municipal",
  storageBucket: "materialidad-municipal.firebasestorage.app",
  messagingSenderId: "166422484968",
  appId: "1:166422484968:web:54efcc2ee11084268ab65d",
  measurementId: "G-DFYETGBW8K"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  query,
  where,
  getDocs,
  setDoc,
  collection,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  auth,
  signInWithEmailAndPassword,
};
