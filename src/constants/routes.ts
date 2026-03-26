/**
 * constants/routes.ts
 *
 * Purpose: All route paths as constants.
 * Never hardcode "/dashboard" in a component — import from here.
 * This prevents broken links when paths change.
 */

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PRACTICE: "/practice",
  ACHIEVEMENTS: "/achievements",
  COURSE: (courseId: string) => `/course/${courseId}`,
  LESSON: (lessonId: string) => `/lesson/${lessonId}`,
} as const;

/** Pages that require authentication to visit */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/course/",
  "/lesson/",
  "/practice",
  "/achievements",
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((prefix) => pathname.startsWith(prefix));
}
