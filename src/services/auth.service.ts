/**
 * services/auth.service.ts
 *
 * Purpose: All Firebase Authentication business logic lives here.
 * This is the ONLY place that calls Firebase Auth methods directly.
 * React components and contexts import from here — never from firebase/auth directly.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Set display name immediately after registration
  await updateProfile(result.user, { displayName });
  return result.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await signOut(auth);
}
