import { Toaster } from "sonner";
import Providers from "./components/providers/provider";
import { BrowserRouter, Routes as ReactRouterRoutes, Route as ReactRouterRoute, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./features/auth/sign-in";
import AppLayout from "./features/AppLayout";
import Dashboard from "./features/dashboard";
import ForgotPassword from "./features/auth/forgot-password";
import Otp from "./features/auth/otp";
import Users from "./features/users";
import ResetPassword from "./features/auth/reset-password";
import { useEffect, useRef } from "react";
import Profile from "./features/profile";
import Settings from "./features/settings";
import i18n from "i18next";
import { getCsrfCookies } from "./lib/services/sessions-service";
import ActivityLogs from "./features/activity-logs";
import NotFoundError from "./features/errors/not-found-error";
import AuthLayout from "./features/auth/auth-layout";
import Categories from "./features/categories";

function App() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      getCsrfCookies();
      hasRun.current = true;
    }
  }, []);

  const lang = i18n.language || "en";
  const isArabic = lang === "ar";
  const direction = isArabic ? "rtl" : "ltr";

  // Set HTML language and direction dynamically
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("lang", lang);
    htmlElement.setAttribute("dir", direction);
  }, [lang, direction]);

  return (
    <Providers>
      <BrowserRouter>
        <ReactRouterRoutes>
          <ReactRouterRoute path="/login" element={<Navigate to="/" replace />} />

          <ReactRouterRoute element={<AuthLayout />}>
            <ReactRouterRoute index path="/" element={<SignIn />} />
            <ReactRouterRoute path="resetPassword" element={<ResetPassword />} />
            <ReactRouterRoute path="forgotPassword" element={<ForgotPassword />} />
            <ReactRouterRoute path="otp" element={<Otp />} />
          </ReactRouterRoute>




          <ReactRouterRoute
            element={
              <ProtectedRoute >
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <ReactRouterRoute
              path="dashboard"
              element={
                <ProtectedRoute requiredPermission="view-dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <ReactRouterRoute
              path="users"
              element={
                <ProtectedRoute requiredPermission="view-user">
                  <Users />
                </ProtectedRoute>
              }
            />
            <ReactRouterRoute
              path="settings"
              element={
                <ProtectedRoute requiredPermission="view-settings">
                  <Settings />
                </ProtectedRoute>
              }
            />
            <ReactRouterRoute
              path="profile"
              element={
                <ProtectedRoute requiredPermission="view-profile">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <ReactRouterRoute
              path="activity-logs"
              element={
                <ProtectedRoute requiredPermission="view-activity-logs">
                  <ActivityLogs />
                </ProtectedRoute>
              }
            />

            <ReactRouterRoute
              path="categories"
              element={
                <ProtectedRoute requiredPermission="view-category">
                  <Categories />
                </ProtectedRoute>
              }
            />
          </ReactRouterRoute>
          <ReactRouterRoute path="*" element={<NotFoundError />} />
        </ReactRouterRoutes>
      </BrowserRouter>

      <Toaster expand position={`top-${isArabic ? "left" : "right"}`} richColors />
    </Providers>
  );
}

export default App;
