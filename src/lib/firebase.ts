import { initializeApp } from "firebase/app";
import {
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "./env";

const firebaseConfig = env.firebase;

const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Use IndexedDB for auth persistence
setPersistence(auth, indexedDBLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
