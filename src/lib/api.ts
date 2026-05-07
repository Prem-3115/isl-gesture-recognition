/**
 * lib/api.ts
 *
 * Single source of truth for the Flask backend API URL.
 * Both PracticePage (health check) and useGestureRecognition (predict) must use this.
 */

export const API_BASE = "http://127.0.0.1:5000";

export const API_HEALTH = `${API_BASE}/health`;
export const API_PREDICT = `${API_BASE}/predict`;
