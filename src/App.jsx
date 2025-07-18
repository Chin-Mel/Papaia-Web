// App.jsx
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/WelcomePage/Welcome";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import ForgotPassword from "./pages/ForgotPasswordPage/ForgotPassword";
import Verification from "./pages/VerificationPage/Verification";
import NewPassword from "./pages/NewPasswordPage/NewPassword";
import Dashboard from "./pages/DashboardPage/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<Verification />} />
      <Route path="/new-password" element={<NewPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
