// NewPasswordModal.jsx - Optimized Version
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import EyeIcon from "../../assets/eye-icon.png";
import EyeOffIcon from "../../assets/eye-off-icon.png";
import { useAlert } from "../../AlertContext";

export default function NewPasswordModal({ user_Id, onPasswordSaved }) {
  const { showAlert } = useAlert();

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
        onPasswordSaved();
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
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white p-6"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-7 h-9 object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Create New Password
          </h2>
          <p className="text-sm text-center opacity-90 mt-1">
            Set a secure password for your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePassword} className="p-6 sm:p-8 space-y-5">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-semibold text-sm">
              Security Verified
            </p>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
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
          <div className="space-y-2">
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
            type="submit"
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
        </form>
      </div>
    </div>
  );
}
