/**
 * lib/env.ts
 *
 * Purpose: Validate all required environment variables at startup.
 * Without this, the app starts silently with missing Firebase config and breaks only
 * when a user tries to log in — confusing and hard to debug.
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

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `[ISL Connect] Missing required environment variables:\n${missing.map((k) => `  • ${k}`).join("\n")}\n\nPlease copy .env.example to .env and add your Firebase config.`
    );
  }
}

// Only validate in development (in production, build will fail if env missing)
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
