import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { SkeletonDashboard, SkeletonPage } from "./components/SkeletonCard";

// Eagerly load the homepage — it's the entry point
import { HomePage } from "./components/pages/HomePage";

// Lazy load all other pages — they only load when the user navigates to them
const CourseDashboard = lazy(() =>
  import("./components/pages/CourseDashboard").then((m) => ({ default: m.CourseDashboard }))
);
const CoursePage = lazy(() =>
  import("./components/pages/CoursePage").then((m) => ({ default: m.CoursePage }))
);
const LessonPage = lazy(() =>
  import("./components/pages/LessonPage").then((m) => ({ default: m.LessonPage }))
);
const PracticePage = lazy(() =>
  import("./components/pages/PracticePage").then((m) => ({ default: m.PracticePage }))
);
const AchievementsPage = lazy(() =>
  import("./components/pages/AchievementsPage").then((m) => ({ default: m.AchievementsPage }))
);
const CommunityPage = lazy(() =>
  import("./components/pages/CommunityPage").then((m) => ({ default: m.CommunityPage }))
);
const AboutPage = lazy(() =>
  import("./components/pages/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const NotFoundPage = lazy(() =>
  import("./components/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);
const ProfilePage = lazy(() =>
  import("./components/pages/ProfilePage").then((m) => ({ default: m.ProfilePage }))
);
const StaticPage = lazy(() =>
  import("./components/pages/StaticPage").then((m) => ({ default: m.StaticPage }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "dashboard",
        element: <Suspense fallback={<SkeletonDashboard />}><CourseDashboard /></Suspense>,
      },
      {
        // Alias: /courses → CourseDashboard (handles direct URL visits & nav link clicks)
        path: "courses",
        element: <Suspense fallback={<SkeletonDashboard />}><CourseDashboard /></Suspense>,
      },
      {
        path: "course/:courseId",
        element: <Suspense fallback={<SkeletonPage />}><CoursePage /></Suspense>,
      },
      {
        path: "lesson/:lessonId",
        element: <Suspense fallback={<SkeletonPage />}><LessonPage /></Suspense>,
      },
      {
        path: "practice",
        element: <Suspense fallback={<SkeletonPage />}><PracticePage /></Suspense>,
      },
      {
        path: "achievements",
        element: <Suspense fallback={<SkeletonPage />}><AchievementsPage /></Suspense>,
      },
      {
        path: "community",
        element: <Suspense fallback={<SkeletonPage />}><CommunityPage /></Suspense>,
      },
      {
        path: "about",
        element: <Suspense fallback={<SkeletonPage />}><AboutPage /></Suspense>,
      },
      {
        path: "profile",
        element: <Suspense fallback={<SkeletonPage />}><ProfilePage /></Suspense>,
      },
      {
        path: "help",
        element: <Suspense fallback={<SkeletonPage />}><StaticPage /></Suspense>,
      },
      {
        path: "accessibility",
        element: <Suspense fallback={<SkeletonPage />}><StaticPage /></Suspense>,
      },
      {
        path: "contact",
        element: <Suspense fallback={<SkeletonPage />}><StaticPage /></Suspense>,
      },
      {
        path: "privacy",
        element: <Suspense fallback={<SkeletonPage />}><StaticPage /></Suspense>,
      },
      {
        path: "terms",
        element: <Suspense fallback={<SkeletonPage />}><StaticPage /></Suspense>,
      },
      {
        // Catch-all: dedicated 404 page instead of silently rendering HomePage
        path: "*",
        element: <Suspense fallback={<SkeletonPage />}><NotFoundPage /></Suspense>,
      },
    ],
  },
]);
