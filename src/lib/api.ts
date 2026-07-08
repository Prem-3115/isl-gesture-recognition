/**
 * lib/api.ts
 *
 * Single source of truth for the Flask backend API URL.
 * Both PracticePage (health check) and useGestureRecognition (predict) must use this.
 *
 * In development: falls back to http://127.0.0.1:5000 (local Flask server).
 * In production: set VITE_API_BASE_URL in your Firebase Hosting / .env to point
 *   to the deployed backend (e.g. https://isl-api.onrender.com).
 */

export const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

export const API_HEALTH = `${API_BASE}/health`;
export const API_PREDICT = `${API_BASE}/predict`;
