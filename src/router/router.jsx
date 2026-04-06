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
import AdminOverviewPage from "../pages/admin/AdminOverviewPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AdminAdminsPage from "../pages/admin/AdminAdminsPage.jsx";
import AdminSubscriptionsPage from "../pages/admin/AdminSubscriptionsPage.jsx";
import AdminModerationPage from "../pages/admin/AdminModerationPage.jsx";
import AdminContentPage from "../pages/admin/AdminContentPage.jsx";
import AdminPackagesPage from "../pages/admin/AdminPackagesPage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import RequireAuth from "./RequireAuth.jsx";
import RequireGuest from "./RequireGuest.jsx";
import RequireRole from "./RequireRole.jsx";
import UpgradePage from "../pages/UpgradePage.jsx";
import BillingPage from "../pages/BillingPage.jsx";
import PaymentSuccessPage from "../pages/PaymentSuccessPage.jsx";
import PaymentCancelPage from "../pages/PaymentCancelPage.jsx";

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
        <RequireRole roles={["admin", "super_admin"]}>
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
        <RequireRole roles={["admin", "super_admin"]}>
          <AppLayout>
            <AdminUsersPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/admins",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin", "super_admin"]}>
          <AppLayout>
            <AdminAdminsPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/subscriptions",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin", "super_admin"]}>
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
        <RequireRole roles={["admin", "super_admin"]}>
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
        <RequireRole roles={["admin", "super_admin"]}>
          <AppLayout>
            <AdminContentPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/admin/packages",
    element: (
      <RequireAuth>
        <RequireRole roles={["admin", "super_admin"]}>
          <AppLayout>
            <AdminPackagesPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/billing",
    element: (
      <RequireAuth>
        <RequireRole roles={["teacher"]} fallbackPath="/admin">
          <AppLayout>
            <BillingPage />
          </AppLayout>
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/upgrade",
    element: (
      <RequireAuth>
        <UpgradePage />
      </RequireAuth>
    ),
  },
  {
    path: "/payment/success",
    element: (
      <RequireAuth>
        <PaymentSuccessPage />
      </RequireAuth>
    ),
  },
  {
    path: "/payment/cancel",
    element: (
      <RequireAuth>
        <PaymentCancelPage />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;


