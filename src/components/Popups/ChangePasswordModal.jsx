import { useState } from "react";
import { AlertTriangle, X, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: "", color: "" };

    let score = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };

    Object.values(requirements).forEach((req) => req && score++);

    if (score <= 1) return { strength: "Weak", color: "text-red-600" };
    if (score <= 2) return { strength: "Fair", color: "text-yellow-500" };
    if (score <= 3) return { strength: "Good", color: "text-green-600" };
    return { strength: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const passwordRequirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { text: "One number", met: /\d/.test(newPassword) },
  ];

  // Verify current password when user stops typing
  const verifyCurrentPassword = async (password) => {
    if (!password || password.length < 3) return;

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/auth/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        setIsCurrentPasswordVerified(true);
        setErrors((prev) => ({ ...prev, currentPassword: "" }));
      } else {
        setIsCurrentPasswordVerified(false);
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setIsCurrentPasswordVerified(false);
      setErrors((prev) => ({
        ...prev,
        currentPassword: "Failed to verify password",
      }));
    }
  };

  // Handle current password change with debouncing
  const handleCurrentPasswordChange = (value) => {
    setCurrentPassword(value);
    setIsCurrentPasswordVerified(false);
    setErrors((prev) => ({ ...prev, currentPassword: "" }));

    // Clear any existing timeout
    if (window.passwordVerifyTimeout) {
      clearTimeout(window.passwordVerifyTimeout);
    }

    // Set new timeout for verification
    if (value.length >= 3) {
      window.passwordVerifyTimeout = setTimeout(() => {
        verifyCurrentPassword(value);
      }, 1000);
    }
  };

  const handleUpdatePassword = async () => {
    if (!canUpdatePassword || isLoading) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            password: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Password updated successfully! Please log in again with your new password."
        );

        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        setErrors({ general: data.message || "Failed to update password" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrors({ general: "Failed to update password" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clear any pending timeout
    if (window.passwordVerifyTimeout) {
      clearTimeout(window.passwordVerifyTimeout);
    }

    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsCurrentPasswordVerified(false);
    setErrors({});
    onClose();
  };

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword;

  const canUpdatePassword =
    isCurrentPasswordVerified &&
    newPassword &&
    confirmPassword &&
    passwordsMatch &&
    allRequirementsMet;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-2 sm:mx-0 max-h-[95vh] sm:max-h-none overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  Change Password
                </h2>
                <p className="text-xs sm:text-sm text-white/90">
                  Update your account password securely
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm sm:text-base">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => handleCurrentPasswordChange(e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm placeholder-gray-400 pr-12 ${
                  errors.currentPassword
                    ? "border-red-500"
                    : isCurrentPasswordVerified
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs">{errors.currentPassword}</p>
            )}
            {isCurrentPasswordVerified && (
              <p className="text-green-500 text-xs">
                ✓ Current password verified
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm sm:text-base">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={!isCurrentPasswordVerified}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm placeholder-gray-400 pr-12 ${
                  !isCurrentPasswordVerified
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={!isCurrentPasswordVerified}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {newPassword && isCurrentPasswordVerified && (
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-gray-600">Password Strength</span>
                <span className={passwordStrength.color}>
                  {passwordStrength.strength}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm sm:text-base">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!isCurrentPasswordVerified}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm placeholder-gray-400 pr-12 ${
                  !isCurrentPasswordVerified
                    ? "bg-gray-100 cursor-not-allowed border-gray-200"
                    : confirmPassword && !passwordsMatch
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!isCurrentPasswordVerified}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Match Error */}
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs sm:text-sm">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {isCurrentPasswordVerified && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h4 className="text-gray-700 font-medium text-sm sm:text-base mb-3">
                Password Requirements:
              </h4>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs sm:text-sm"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        req.met ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={req.met ? "text-green-700" : "text-gray-600"}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePassword}
            disabled={!canUpdatePassword || isLoading}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
              canUpdatePassword && !isLoading
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
