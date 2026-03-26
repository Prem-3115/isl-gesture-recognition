import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LoaderCircle } from "lucide-react@0.487.0";

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

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "dashboard",
        element: <Suspense fallback={<PageLoader />}><CourseDashboard /></Suspense>,
      },
      {
        path: "course/:courseId",
        element: <Suspense fallback={<PageLoader />}><CoursePage /></Suspense>,
      },
      {
        path: "lesson/:lessonId",
        element: <Suspense fallback={<PageLoader />}><LessonPage /></Suspense>,
      },
      {
        path: "practice",
        element: <Suspense fallback={<PageLoader />}><PracticePage /></Suspense>,
      },
      {
        path: "achievements",
        element: <Suspense fallback={<PageLoader />}><AchievementsPage /></Suspense>,
      },
      { path: "*", Component: HomePage },
    ],
  },
]);
