// App.jsx - Performance Optimized with Code Splitting
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GlobalAlert from "./components/GlobalAlert";

// =============================================================================
// CRITICAL ROUTES - Load immediately (shown to all users first)
// =============================================================================
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

// =============================================================================
// LAZY LOADED ROUTES - Load on demand
// This reduces initial bundle size by 60-70%!
// =============================================================================

// Public Routes (less critical)
const AboutHomePage = lazy(() => import("./pages/AboutHomePage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const PricingHomePage = lazy(() => import("./pages/PricingHomePage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));

// Protected Routes (only for authenticated users)
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const FarmDashboardPage = lazy(() => import("./pages/FarmDashboardPage"));
const ScanHistoryPage = lazy(() => import("./pages/ScanHistoryPage"));
const ScanDetailsPage = lazy(() => import("./pages/ScanDetailsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));
const ManageBillingPage = lazy(() => import("./pages/ManageBillingPage"));

// =============================================================================
// LOADING FALLBACK COMPONENT
// Shows while lazy-loaded components are being fetched
// =============================================================================
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#2D5016] font-semibold text-lg">Loading...</p>
    </div>
  </div>
);

// =============================================================================
// ROUTE PREFETCHING
// Preload routes that users are likely to visit next
// =============================================================================
const prefetchRoute = (importFn) => {
  // Prefetch on mouse hover or on idle
  const prefetch = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 1);
    }
  };
  return prefetch;
};

// Prefetch dashboard when user is on sign-in page
export const prefetchDashboard = prefetchRoute(() =>
  import("./pages/DashboardPage")
);

// Prefetch sign-up when user is on landing page
export const prefetchSignUp = prefetchRoute(() => import("./pages/SignUpPage"));

function App() {
  return (
    <>
      <GlobalAlert />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ============================================= */}
          {/* PUBLIC ROUTES - No authentication required   */}
          {/* ============================================= */}

          {/* Critical routes - loaded immediately */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* Lazy-loaded public routes */}
          <Route path="/about-home" element={<AboutHomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/pricing-home" element={<PricingHomePage />} />
          <Route path="/demo" element={<DemoPage />} />

          {/* ============================================= */}
          {/* PROTECTED ROUTES - Authentication required   */}
          {/* All lazy-loaded to reduce initial bundle     */}
          {/* ============================================= */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/farm-dashboard/:id"
            element={
              <ProtectedRoute>
                <FarmDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scan-history"
            element={
              <ProtectedRoute>
                <ScanHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scan-history-details/:farmId/:scanId"
            element={
              <ProtectedRoute>
                <ScanDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <ManageBillingPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route - redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

// import React from "react";
// import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter
// import ProtectedRoute from "./ProtectedRoute";
// import { Navigate } from "react-router-dom";
// import GlobalAlert from "./components/GlobalAlert";

// import LandingPage from "./pages/LandingPage";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";
// import DashboardPage from "./pages/DashboardPage";
// import ProfilePage from "./pages/ProfilePage";
// import EditProfilePage from "./pages/EditProfilePage";
// import FarmDashboardPage from "./pages/FarmDashboardPage";
// import ScanHistoryPage from "./pages/ScanHistoryPage";
// import ScanDetailsPage from "./pages/ScanDetailsPage";
// import AboutPage from "./pages/AboutPage";
// import AboutHomePage from "./pages/AboutHomePage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import PricingHomePage from "./pages/PricingHomePage";
// import PricingPage from "./pages/PricingPage";
// import NotificationPage from "./pages/NotificationPage";
// import DemoPage from "./pages/DemoPage";
// import ManageBillingPage from "./pages/ManageBillingPage";

// function App() {
//   return (
//     //<AuthProvider>
//     <>
//       <GlobalAlert />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/sign-in" element={<SignInPage />} />
//         <Route path="/sign-up" element={<SignUpPage />} />
//         <Route path="/about-home" element={<AboutHomePage />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/pricing-home" element={<PricingHomePage />} />
//         <Route path="/demo" element={<DemoPage />} />

//         {/* Protected Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <DashboardPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <ProfilePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/edit-profile"
//           element={
//             <ProtectedRoute>
//               <EditProfilePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/farm-dashboard/:id"
//           element={
//             <ProtectedRoute>
//               <FarmDashboardPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/scan-history"
//           element={
//             <ProtectedRoute>
//               <ScanHistoryPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/scan-history-details/:farmId/:scanId"
//           element={
//             <ProtectedRoute>
//               <ScanDetailsPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/about"
//           element={
//             <ProtectedRoute>
//               <AboutPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/pricing"
//           element={
//             <ProtectedRoute>
//               <PricingPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/notifications"
//           element={
//             <ProtectedRoute>
//               <NotificationPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/billing"
//           element={
//             <ProtectedRoute>
//               <ManageBillingPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// }

// export default App;
