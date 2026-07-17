import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CoursePage from "./pages/courses";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ChaptersPage from "./pages/chapters";
import LessonsPage from "./pages/lessons";
import LessonPage from "./pages/lesson";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminCoursePage from "./pages/adminCourses";
import AdminChaptersPage from "./pages/adminChapter";
import AdminLessonsPage from "./pages/adminLesson";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/courses", element: <CoursePage /> },
  { path: "/admin/courses", element: <AdminCoursePage /> },
  { path: "/courses/:courseId", element: <ChaptersPage /> },
  { path: "/admin/courses/:courseId", element: <AdminChaptersPage /> },
  {
    path: "/admin/courses/:courseId/chapters/:chapterId/lessons",
    element: <AdminLessonsPage />,
  },
  { path: "/courses/:courseId/chapters/:chapterId", element: <LessonsPage /> },
  {
    path: "/courses/:courseId/chapters/:chapterId/lessons/:lessonId",
    element: <LessonPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
