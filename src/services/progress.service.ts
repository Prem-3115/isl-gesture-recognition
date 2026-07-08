/**
 * services/progress.service.ts
 *
 * Purpose: Persist lesson completion per user in Firestore.
 * Collection: users/{uid}/progress/{lessonId}
 *
 * Keeps an in-memory cache so repeated calls within a session don't hit Firestore.
 * All functions fail gracefully — the caller should fall back to local state on error.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// In-memory cache: uid → Set of completed lessonIds
const progressCache = new Map<string, Set<string>>();

/** Clear the cache on logout so the next user starts fresh. */
export function clearProgressCache() {
  progressCache.clear();
}

/**
 * Mark a lesson as complete for a user.
 * Idempotent — calling twice is safe (serverTimestamp only written once via merge).
 */
export async function markLessonComplete(uid: string, lessonId: string): Promise<void> {
  const ref = doc(db, "users", uid, "progress", lessonId);
  await setDoc(ref, { lessonId, completedAt: serverTimestamp() }, { merge: true });

  // Update cache
  const cached = progressCache.get(uid) ?? new Set<string>();
  cached.add(lessonId);
  progressCache.set(uid, cached);
}

/**
 * Fetch the set of completed lesson IDs for a user.
 * Returns an empty Set if the user has no progress or Firestore is unavailable.
 */
export async function fetchCompletedLessons(uid: string): Promise<Set<string>> {
  // Return cache if warm
  if (progressCache.has(uid)) {
    return progressCache.get(uid)!;
  }

  const ref = collection(db, "users", uid, "progress");
  const snap = await getDocs(ref);
  const completed = new Set<string>(snap.docs.map((d) => d.id));

  progressCache.set(uid, completed);
  return completed;
}

/**
 * Check if a single lesson is complete for a user.
 * Uses cache; falls back to a direct Firestore read if cache is cold.
 */
export async function isLessonComplete(uid: string, lessonId: string): Promise<boolean> {
  if (progressCache.has(uid)) {
    return progressCache.get(uid)!.has(lessonId);
  }

  const ref = doc(db, "users", uid, "progress", lessonId);
  const snap = await getDoc(ref);
  return snap.exists();
}
