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

// In-memory cache — prevents redundant Firestore reads on every auth state change
let profileCache: UserProfile | null = null;

export function clearProfileCache() {
  profileCache = null;
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
  // Return cache if it belongs to the same user
  if (profileCache?.uid === uid) return profileCache;

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  let profile: UserProfile;

  if (!snap.exists()) {
    profile = {
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
  } else {
    await updateDoc(userRef, { lastLogin: Date.now() });
    profile = snap.data() as UserProfile;
  }

  profileCache = profile;
  return profile;
}

export async function getUserProfile(uid: string) {
  if (profileCache?.uid === uid) return profileCache;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const profile = snap.exists() ? (snap.data() as UserProfile) : null;
  if (profile) profileCache = profile;
  return profile;
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
  // Update cache too
  if (profileCache?.uid === uid) {
    profileCache = { ...profileCache, stats };
  }
}
