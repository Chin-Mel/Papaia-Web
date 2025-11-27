import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

// Success Modal Component
export default function NewPasswordModal({ user_Id, onPasswordSaved }) {
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
            userId: user_Id,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header with gradient background */}
        <div
          className="flex flex-col items-center justify-center text-white p-4"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Logo"
              className="w-7 h-9 sm:w-7 sm:h-9"
            />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-center">
            Create New Password
          </h2>
          <p className="text-[9px] sm:text-xs md:text-sm text-center opacity-90 mt-1">
            Set a secure password for your account
          </p>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-6 space-y-4">
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

            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {passwordError}
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-700 text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Requirements */}
            {newPassword && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      newPassword.length >= 8
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>{newPassword.length >= 8 ? "✓" : "○"}</span>
                    <span>At least 8 characters</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      /[A-Z]/.test(newPassword)
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
                    <span>One uppercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      /[a-z]/.test(newPassword)
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>{/[a-z]/.test(newPassword) ? "✓" : "○"}</span>
                    <span>One lowercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      /[0-9]/.test(newPassword)
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
                    <span>One number</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"}
                    </span>
                    <span>One special character</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 text-xs ${
                      newPassword === confirmPassword && confirmPassword
                        ? "text-green-600 font-semibold"
                        : "text-blue-700"
                    }`}
                  >
                    <span>
                      {newPassword === confirmPassword && confirmPassword
                        ? "✓"
                        : "○"}
                    </span>
                    <span>Passwords match</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            disabled={!isPasswordValid || loading}
            onClick={handleSavePassword}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isPasswordValid && !loading
                ? "bg-[#F97316] hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowRight className="w-5 h-5" />
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
