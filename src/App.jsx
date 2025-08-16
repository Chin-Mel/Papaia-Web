// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AuthGuard from "./components/AuthGuard";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Routes */}
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
          <Route
            path="/farm-dashboard"
            element={
              <AuthGuard>
                <FarmDashboardPage />
              </AuthGuard>
            }
          />
          <Route
            path="/scan-history"
            element={
              <AuthGuard>
                <ScanHistoryPage />
              </AuthGuard>
            }
          />
          <Route
            path="/scan-details"
            element={
              <AuthGuard>
                <ScanDetailsPage />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
