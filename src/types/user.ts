/**
 * types/user.ts
 *
 * Purpose: Shared data types for user/profile objects.
 * Keep all data types here — components, services, and contexts import from here.
 */

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
