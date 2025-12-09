import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, X, Eye, EyeOff } from "lucide-react";
import { useAlert } from "../../AlertContext";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { showAlert } = useAlert();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleUpdatePassword = async () => {
    // Reset errors
    setCurrentPasswordError(false);
    setNewPasswordError(false);
    setConfirmPasswordError(false);

    // Basic validation
    if (!currentPassword.trim()) {
      setCurrentPasswordError(true);
      showAlert("error", "Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      setNewPasswordError(true);
      showAlert("error", "Please enter a new password");
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(true);
      showAlert("error", "Please confirm your new password");
      return;
    }

    // Remove length, match, and difference checks
    setIsLoading(true);

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

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        showAlert(
          "success",
          "Password updated successfully! You will be redirected to login."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/sign-in");
      } else {
        if (
          response.status === 401 ||
          data.error?.includes("current password")
        ) {
          setCurrentPasswordError(true);
          showAlert("error", "Current password is incorrect");
        } else {
          showAlert("error", data.error || "Failed to update password");
        }
      }
    } catch (err) {
      showAlert("error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError(false);
    setNewPasswordError(false);
    setConfirmPasswordError(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#00712D]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Change Password
              </h2>
              <p className="text-sm text-white/90">
                Update your account password securely
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setCurrentPasswordError(false);
                  }}
                  placeholder="Enter current password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-12 text-sm transition-all ${
                    currentPasswordError
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-orange-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordError(false);
                  }}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-12 text-sm transition-all ${
                    newPasswordError
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-orange-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {newPassword && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(false);
                  }}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none pr-12 text-sm transition-all ${
                    confirmPasswordError
                      ? "border-red-500 focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-orange-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> After changing your password, you'll be
                logged out and need to sign in again with your new password.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePassword}
            disabled={
              isLoading ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim()
            }
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              isLoading ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Updating...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
