import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderStart from "../components/Header/HeaderStart";
import { FaSignInAlt } from "react-icons/fa";

export default function NewPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || ""; // ✅ From Verify OTP page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderStart />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/hero-background.png')" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
          <div
            className="flex flex-col items-center justify-center text-white p-6"
            style={{
              backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
            }}
          >
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <FaSignInAlt className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-bold">Set New Password</h2>
            <p className="text-sm text-center opacity-90 mt-1">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-2">{success}</p>
            )}

            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 mt-1 border-[#E5E7EB] placeholder-[#ADAEBC] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 mt-1 border-[#E5E7EB] placeholder-[#ADAEBC] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow disabled:opacity-50"
              style={{
                backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
              }}
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <FaSignInAlt /> Update Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
