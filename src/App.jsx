// App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "./pages/WelcomePage/Welcome";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPassword";
import Verification from "./pages/VerificationPage/Verification";
import NewPassword from "./pages/NewPasswordPage/NewPassword";
import Dashboard from "./pages/DashboardPage/Dashboard";
import FarmDashboard from "./pages/FarmDashboardPage/FarmDashboard";
import About from "./pages/AboutPage/About";
import Profile from "./pages/ProfilePage/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
