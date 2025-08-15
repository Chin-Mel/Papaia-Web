// App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPassword";
import Verification from "./pages/VerificationPage/Verification";
import NewPassword from "./pages/NewPasswordPage/NewPassword";
import Dashboard from "./pages/DashboardPage/Dashboard";
import FarmDashboard from "./pages/FarmDashboardPage/FarmDashboard";
import AboutPage from "./pages/AboutPage";
import Profile from "./pages/ProfilePage/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<Verification />} />
      <Route path="/new-password" element={<NewPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmdashboard/:farmId"
        element={
          <ProtectedRoute>
            <FarmDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
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
    </Routes>
  );
}

export default App;
