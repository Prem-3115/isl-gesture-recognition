import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  lastLogin: number;
  stats?: {
    totalAttempts: number;
    successfulAttempts: number;
    bestAccuracy: number;
  };
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const profile: UserProfile = {
      uid,
      displayName: data.displayName || "User",
      email: data.email || "",
      photoURL: data.photoURL || "",
      createdAt: Date.now(),
      lastLogin: Date.now(),
      stats: {
        totalAttempts: 0,
        successfulAttempts: 0,
        bestAccuracy: 0,
      },
    };
    await setDoc(userRef, profile);
    return profile;
  } else {
    // Update last login
    await updateDoc(userRef, { lastLogin: Date.now() });
    return snap.data() as UserProfile;
  }
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserStats(
  uid: string,
  stats: { totalAttempts: number; successfulAttempts: number; bestAccuracy: number }
) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    "stats.totalAttempts": stats.totalAttempts,
    "stats.successfulAttempts": stats.successfulAttempts,
    "stats.bestAccuracy": stats.bestAccuracy,
  });
}
