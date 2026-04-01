/**
 * lib/env.ts
 *
 * Purpose: Validate all required environment variables at startup.
 * Without this, the app starts silently with missing Firebase config and breaks only
 * when a user tries to log in, which is confusing and hard to debug.
 * With this, you get a clear error at startup listing exactly what's missing.
 */

const REQUIRED_ENV_VARS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const PLACEHOLDER_PATTERNS = [
  /^your[_-]/i,
  /^replace[_-]/i,
  /^example/i,
  /^placeholder/i,
  /^changeme$/i,
  /^test$/i,
] as const;

function isPlaceholderValue(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return true;
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalized));
}

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => {
    const value = import.meta.env[key];
    return typeof value !== "string" || !value.trim();
  });

  const invalid = REQUIRED_ENV_VARS.filter((key) => {
    const value = import.meta.env[key];
    return typeof value === "string" && isPlaceholderValue(value);
  });

  if (missing.length > 0) {
    throw new Error(
      `[ISL Connect] Missing required environment variables:\n${missing
        .map((key) => `  - ${key}`)
        .join("\n")}\n\nPlease copy .env.example to .env and add your Firebase Web App config.`
    );
  }

  if (invalid.length > 0) {
    throw new Error(
      `[ISL Connect] Invalid Firebase environment variables:\n${invalid
        .map((key) => `  - ${key}`)
        .join("\n")}\n\nReplace placeholder values in .env with the Firebase Web App config from Firebase Console -> Project settings -> Your apps.`
    );
  }
}

if (import.meta.env.DEV) {
  validateEnv();
}

export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  },
} as const;
