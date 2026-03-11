import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import OtpVerificationPage from "../pages/OtpVerificationPage.jsx";
import LoginSuccessPage from "../pages/LoginSuccessPage.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import LegalDocumentationPage from "../pages/LegalDocumentationPage.jsx";
import TermsOfServicePage from "../pages/TermsOfServicePage.jsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage.jsx";
import AIDisclaimerPage from "../pages/AIDisclaimerPage.jsx";
import AcceptableUsePolicyPage from "../pages/AcceptableUsePolicyPage.jsx";
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
import AppLayout from "../components/layout/AppLayout.jsx";
import RequireAuth from "./RequireAuth.jsx";
import RequireGuest from "./RequireGuest.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <RequireGuest>
        <LoginPage />
      </RequireGuest>
    ),
  },
  {
    path: "/signup",
    element: (
      <RequireGuest>
        <SignupPage />
      </RequireGuest>
    ),
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
    path: "/legal",
    element: <LegalDocumentationPage />,
  },
  {
    path: "/legal/terms",
    element: <TermsOfServicePage />,
  },
  {
    path: "/legal/privacy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/legal/ai-disclaimer",
    element: <AIDisclaimerPage />,
  },
  {
    path: "/legal/acceptable-use",
    element: <AcceptableUsePolicyPage />,
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
    path: "/curriculum/:id",
    element: (
      <RequireAuth>
        <AppLayout>
          <CurriculumViewPage />
        </AppLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/students/:id",
    element: (
      <RequireAuth>
        <AppLayout>
          <StudentDataViewPage />
        </AppLayout>
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
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;


