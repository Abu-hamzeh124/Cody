import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import CoursePage from "./pages/courses";
import DashboardPage from "./pages/dashboard";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ChaptersPage from "./pages/chapters";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
  { path: "/courses", element: <CoursePage /> },
  { path: "/courses/:courseId", element: <ChaptersPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
