import { useState } from "react";
import { ArrowRight, Home } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import EyeIcon from "../../assets/eye-icon.png";
import EyeOffIcon from "../../assets/eye-off-icon.png";

// Success Modal Component
export default function NewPasswordModal({ userId, onPasswordSaved }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain a special character";
    return "";
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    const validationError = validatePassword(value);

    if (validationError) {
      setPasswordError(validationError);
    } else if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    const validationError = validatePassword(newPassword);

    if (validationError) {
      setPasswordError(validationError);
    } else if (newPassword !== value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSavePassword = async () => {
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    setPasswordError("");

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idNumber: userId,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Password reset successfully
        onPasswordSaved();
      } else {
        setPasswordError(
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      setPasswordError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid =
    newPassword &&
    !validatePassword(newPassword) &&
    confirmPassword &&
    newPassword === confirmPassword;

  return (
    <div className="flex justify-center items-start min-h-screen px-4 pt-12 sm:pt-16 md:pt-20 pb-6">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.15)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-6 sm:py-7 md:py-8 px-4"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 sm:mb-4 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Logo"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Create New Password
          </h2>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-6 md:px-8 py-5 sm:py-6 md:py-7">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-semibold text-xs sm:text-sm">
              Security Verified
            </p>
          </div>

          <p className="text-gray-600 text-center mb-5 sm:mb-6 text-xs sm:text-sm">
            Your account is ready to set a new password.
          </p>

          {/* New Password */}
          <div className="mb-3 sm:mb-4">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1 mb-1.5">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <img
                src={showNewPassword ? EyeOffIcon : EyeIcon}
                alt="toggle visibility"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1 mb-1.5">
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <img
                src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                alt="toggle visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
              />
            </div>
          </div>

          {/* Error */}
          {passwordError && (
            <p className="text-red-500 text-xs sm:text-sm text-center mb-3 sm:mb-4">
              {passwordError}
            </p>
          )}

          {/* Requirements */}
          {newPassword && (
            <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-1.5 sm:mb-2">
                Password must contain:
              </p>
              <ul className="text-xs sm:text-sm space-y-1">
                <li
                  className={
                    newPassword.length >= 8
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[a-z]/.test(newPassword) ? "✓" : "○"} One lowercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[0-9]/.test(newPassword) ? "✓" : "○"} One number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"} One
                  special character
                </li>
              </ul>
            </div>
          )}

          {/* Save Button */}
          <button
            disabled={!isPasswordValid || loading}
            onClick={handleSavePassword}
            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
              !isPasswordValid || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
