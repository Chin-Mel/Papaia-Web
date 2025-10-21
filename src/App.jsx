import React from "react";
import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import FarmDashboardPage from "./pages/FarmDashboardPage";
import ScanHistoryPage from "./pages/ScanHistoryPage";
import ScanDetailsPage from "./pages/ScanDetailsPage";
import AboutPage from "./pages/AboutPage";
import AboutHomePage from "./pages/AboutHomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PricingHomePage from "./pages/PricingHomePage";
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    //<AuthProvider>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/about-home" element={<AboutHomePage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pricing-home" element={<PricingHomePage />} />

      {/* Protected Routes */}
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
        path="//scan-history-details/:scanId"
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    //</AuthProvider>
  );
}

export default App;
