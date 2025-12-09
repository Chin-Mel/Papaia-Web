// NewPasswordModal.jsx - Matched to OTP Modal Dimensions
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import EyeIcon from "../../assets/eye-icon.png";
import EyeOffIcon from "../../assets/eye-off-icon.png";
import { useAlert } from "../../AlertContext";

export default function NewPasswordModal({ user_Id }) {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touched state
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Get border class based on validation
  const getBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "newPassword") {
      setNewPassword(value);
    } else if (fieldName === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear touched state when user starts typing
    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handle save password
  const handleSavePassword = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all as touched
    setTouched({
      newPassword: true,
      confirmPassword: true,
    });

    // Validate required fields
    if (!newPassword || !confirmPassword) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      showAlert("error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user_Id,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert(
          "success",
          "Password Updated Successfully. You can now login using your new password.",
          3000
        );
        navigate("/sign-in");
      } else {
        showAlert(
          "error",
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      showAlert(
        "error",
        "Failed to connect to server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSavePassword();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header - Matched to OTP Modal */}
        <div
          className="flex flex-col items-center justify-center text-white p-4"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl mb-2 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-6 h-8 object-contain"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-center">
            Create New Password
          </h2>
        </div>

        {/* Form - Matched padding to OTP Modal */}
        <div className="bg-white p-6 sm:p-8">
          <p className="text-base sm:text-lg text-center text-[#00712D] mb-6 font-medium">
            Set a secure password for your account
          </p>

          {/* New Password Field */}
          <div className="space-y-2 mb-5">
            <label className="text-gray-700 text-sm font-medium block">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) =>
                  handleFieldChange("newPassword", e.target.value)
                }
                onBlur={() => handleBlur("newPassword")}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all ${getBorderClass(
                  "newPassword",
                  newPassword
                )}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <img
                  src={showNewPassword ? EyeOffIcon : EyeIcon}
                  alt=""
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2 mb-6">
            <label className="text-gray-700 text-sm font-medium block">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  handleFieldChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all ${getBorderClass(
                  "confirmPassword",
                  confirmPassword
                )}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <img
                  src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                  alt=""
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleSavePassword}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
