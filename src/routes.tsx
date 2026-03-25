import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AchievementsPage } from "./components/pages/AchievementsPage";
import { CourseDashboard } from "./components/pages/CourseDashboard";
import { CoursePage } from "./components/pages/CoursePage";
import { HomePage } from "./components/pages/HomePage";
import { LessonPage } from "./components/pages/LessonPage";
import { PracticePage } from "./components/pages/PracticePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "dashboard", Component: CourseDashboard },
      { path: "course/:courseId", Component: CoursePage },
      { path: "lesson/:lessonId", Component: LessonPage },
      { path: "practice", Component: PracticePage },
      { path: "achievements", Component: AchievementsPage },
      { path: "*", Component: HomePage },
    ],
  },
]);
