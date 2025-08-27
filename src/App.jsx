import { Routes, Route } from "react-router-dom";
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
import NewPasswordModal from "./components/Popups/NewPasswordModal";
import OtpVerificationModal from "./components/Popups/OtpVerificationModal";
import PasswordUpdatedModal from "./components/Popups/PasswordUpdatedModal";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/about-home" element={<AboutHomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordModal />} />
        <Route path="/otp-verification" element={<OtpVerificationModal />} />
        <Route path="/changed-password" element={<PasswordUpdatedModal />} />

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
          path="/scan-details"
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

        {/* Catch-all route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
