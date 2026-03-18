import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import OtpVerificationPage from "../pages/OtpVerificationPage.jsx";
import LoginSuccessPage from "../pages/LoginSuccessPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import UploadCurriculumPage from "../pages/UploadCurriculumPage.jsx";
import UploadStudentsPage from "../pages/UploadStudentsPage.jsx";
import GenerateLessonPage from "../pages/GenerateLessonPage.jsx";
import LessonViewPage from "../pages/LessonViewPage.jsx";
import LessonPlansPage from "../pages/LessonPlansPage.jsx";
import CurriculumViewPage from "../pages/CurriculumViewPage.jsx";
import StudentDataViewPage from "../pages/StudentDataViewPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import AdminOverviewPage from "../pages/admin/AdminOverviewPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AdminSubscriptionsPage from "../pages/admin/AdminSubscriptionsPage.jsx";
import AdminModerationPage from "../pages/admin/AdminModerationPage.jsx";
import AdminContentPage from "../pages/admin/AdminContentPage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import RequireAuth from "./RequireAuth.jsx";
import RequireRole from "./RequireRole.jsx";

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
    path: "/verify-otp",
    element: <OtpVerificationPage />,
  },
  {
    path: "/login-success",
    element: <LoginSuccessPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <div className="p-4">Error loading page</div>,
  },
  {
    path: "/upload-curriculum",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <UploadCurriculumPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/upload-students",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <UploadStudentsPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/generate-lesson",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <GenerateLessonPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/lessons",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <LessonPlansPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/lessons/:id",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <LessonViewPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/curriculum/:id",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <CurriculumViewPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/students/:id",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <StudentDataViewPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <AppLayout>
          <ProfilePage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin"]}>
          <AppLayout>
            <AdminOverviewPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin"]}>
          <AppLayout>
            <AdminUsersPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/subscriptions",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin"]}>
          <AppLayout>
            <AdminSubscriptionsPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/moderation",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin"]}>
          <AppLayout>
            <AdminModerationPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/content",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin"]}>
          <AppLayout>
            <AdminContentPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;


