import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import UploadCurriculumPage from "../pages/UploadCurriculumPage.jsx";
import UploadStudentsPage from "../pages/UploadStudentsPage.jsx";
import GenerateLessonPage from "../pages/GenerateLessonPage.jsx";
import LessonViewPage from "../pages/LessonViewPage.jsx";
import LessonPlansPage from "../pages/LessonPlansPage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import RequireAuth from "./RequireAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </RequireAuth>
    ),
    errorElement: <div className="p-4">Error loading page</div>,
  },
  {
    path: "/upload-curriculum",
    element: (
      <RequireAuth>
        <AppLayout>
          <UploadCurriculumPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/upload-students",
    element: (
      <RequireAuth>
        <AppLayout>
          <UploadStudentsPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/generate-lesson",
    element: (
      <RequireAuth>
        <AppLayout>
          <GenerateLessonPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/lessons",
    element: (
      <RequireAuth>
        <AppLayout>
          <LessonPlansPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/lessons/:id",
    element: (
      <RequireAuth>
        <AppLayout>
          <LessonViewPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;


