import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
  limit,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVkO7Y8iN7CjnTna_2WXEWA4VK_YNFBs4",
  authDomain: "genomic-platform-e3c35.firebaseapp.com",
  projectId: "genomic-platform-e3c35",
  storageBucket: "genomic-platform-e3c35.appspot.com",
  messagingSenderId: "300756282583",
  appId: "1:300756282583:web:7cc77460147549dd61d492",
  measurementId: "G-6QVRFG1X4W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fbSignOut as signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  ref,
  uploadBytesResumable,
  deleteDoc,
  getDownloadURL,
};

// ✅ Role checker
export async function getUserRole(uid) {
  if (!uid) return null;
  const refUser = doc(db, "users", uid);
  const snap = await getDoc(refUser);
  if (snap.exists()) return snap.data().role || "user";
  return "user";
}
