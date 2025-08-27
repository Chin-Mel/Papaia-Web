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
import AuthGuard from "./components/AuthGuard";
import ProtectedRoute from "./ProtectedRoute";
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

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <AuthGuard>
              <EditProfilePage />
            </AuthGuard>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
