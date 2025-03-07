import { initializeApp } from 'firebase/app';
import { getFirestore, query, where, getDocs, collection, deleteDoc, doc, addDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

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
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
};