import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/about-home" element={<AboutHomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/farm-dashboard/:id" element={<FarmDashboardPage />} />
            <Route path="/scan-history" element={<ScanHistoryPage />} />
            <Route path="/scan-details" element={<ScanDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
