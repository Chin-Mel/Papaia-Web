// App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import Register from "./pages/RegisterPage/Register.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import OtpVerificationPage from "./pages/OtpVerificationPage.jsx";
import NewPasswordPage from "./pages/NewPasswordPage.jsx";
import Dashboard from "./pages/DashboardPage/Dashboard.jsx";
import FarmDashboard from "./pages/FarmDashboardPage/FarmDashboard.jsx";
import Profile from "./pages/ProfilePage/Profile.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/new-password" element={<NewPasswordPage />} />

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
    </Routes>
  );
}

export default App;
