import { Suspense, lazy, useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import Providers from './components/providers/provider';
import {
  BrowserRouter,
  Routes as ReactRouterRoutes,
  Route as ReactRouterRoute,
  Navigate,
} from 'react-router-dom';
import i18n from 'i18next';
import { getCsrfCookies } from './lib/services/sessions-service';

import StaticFullPageSpinner from './components/StaticFullPageSpinner';


const SignIn = lazy(() => import('./features/auth/sign-in'));
const ForgotPassword = lazy(() => import('./features/auth/forgot-password'));
const Otp = lazy(() => import('./features/auth/otp'));
const ResetPassword = lazy(() => import('./features/auth/reset-password'));

const Dashboard = lazy(() => import('./features/dashboard'));
const Users = lazy(() => import('./features/users'));
const Profile = lazy(() => import('./features/profile'));
const Settings = lazy(() => import('./features/settings'));
const ActivityLogs = lazy(() => import('./features/activity-logs'));
const Categories = lazy(() => import('./features/categories'));
const Products = lazy(() => import('./features/products'));
const NotFoundError = lazy(() => import('./features/errors/not-found-error'));
const AuthLayout = lazy(() => import('./features/auth/auth-layout'));
const AppLayout = lazy(() => import('./features/AppLayout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const ProductFormView = lazy(() => import('./features/products/components/form/ProductFormView'));
const Stocks = lazy(() => import('./features/stocks'));
const StockAdjustments = lazy(() => import('./features/stock-adjustments'));


function App() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      getCsrfCookies();
      hasRun.current = true;
    }
  }, []);

  const lang = i18n.language || 'en';
  const isArabic = lang === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', lang);
    htmlElement.setAttribute('dir', direction);
  }, [lang, direction]);


  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<StaticFullPageSpinner />}>
          <ReactRouterRoutes>
            <ReactRouterRoute path="/login" element={<Navigate to="/" replace />} />

            <ReactRouterRoute element={<AuthLayout />}>
              <ReactRouterRoute index path="/" element={<SignIn />} />
              <ReactRouterRoute path="resetPassword" element={<ResetPassword />} />
              <ReactRouterRoute path="forgotPassword" element={<ForgotPassword />} />
              <ReactRouterRoute path="otp" element={<Otp />} />
            </ReactRouterRoute>

            <ReactRouterRoute element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
              <ReactRouterRoute
                path="products"
                element={
                  <ProtectedRoute requiredPermission="view-product">
                    <Products />
                  </ProtectedRoute>
                }
              />
              <ReactRouterRoute
                path="products/new"
                element={
                  <ProtectedRoute requiredPermission="create-product">
                    <ProductFormView />
                  </ProtectedRoute>
                }
              />
              <ReactRouterRoute
                path="products/:id/edit"
                element={
                  <ProtectedRoute requiredPermission="edit-product">
                    <ProductFormView />
                  </ProtectedRoute>
                }
              />
              <ReactRouterRoute
  path="stocks"
  element={
    <ProtectedRoute requiredPermission="view-stock">
      <Stocks />
    </ProtectedRoute>
  }
/>
<ReactRouterRoute
  path="stock-adjustments"
  element={
    <ProtectedRoute requiredPermission="view-stock-adjustment">
      <StockAdjustments />
    </ProtectedRoute>
  }
/>
            </ReactRouterRoute>

            <ReactRouterRoute path="*" element={<NotFoundError />} />
          </ReactRouterRoutes>
        </Suspense>
      </BrowserRouter>

      <Toaster expand position={`top-${isArabic ? 'left' : 'right'}`} richColors />
    </Providers>
  );
}

export default App;

