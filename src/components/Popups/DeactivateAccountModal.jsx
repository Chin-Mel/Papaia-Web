import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeactivateAccountModal({ isOpen, onClose }) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeactivate = async () => {
    if (!acknowledged) return;

    setIsLoading(true);
    setError("");

    try {
      const selectedReason = reason === "Other" ? otherReason : reason;

      // Note: The API documentation doesn't show a deactivate endpoint
      // This endpoint may need to be created or you might need to use a different approach
      // For now, using a generic user update endpoint
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/user/${
          JSON.parse(localStorage.getItem("user"))?.id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: "inactive",
            deactivationReason: selectedReason,
          }),
        }
      );

      if (response.ok) {
        alert("Account deactivated successfully. You will be logged out.");

        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        const errorText = await response.text();
        let errorMessage;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.error ||
            errorData.message ||
            "Failed to deactivate account";
        } catch {
          errorMessage = `Failed to deactivate account (${response.status})`;
        }

        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error deactivating account:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setReason("");
    setOtherReason("");
    setAcknowledged(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg mx-2 sm:mx-0 max-h-[95vh] sm:max-h-none overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                Deactivate Account
              </h2>
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
        <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Warning message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs sm:text-sm font-bold">
                  !
                </span>
              </div>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Deactivating your account will temporarily disable your profile
                and farm access. You can reactivate anytime by logging back in.
              </p>
            </div>
          </div>

          {/* Reason selection */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-gray-700 font-medium text-sm sm:text-base mb-2 block">
              Why are you deactivating your account?
            </label>
            {[
              "I no longer use the app",
              "I want to take a break",
              "Privacy concerns",
              "Technical issues",
              "Other",
            ].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="deactivateReason"
                  value={item}
                  checked={reason === item}
                  onChange={() => setReason(item)}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 border-gray-300 focus:ring-orange-400 focus:ring-2"
                />
                <span className="text-gray-700 text-xs sm:text-sm group-hover:text-gray-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>

          {/* Other reason input */}
          {reason === "Other" && (
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm">
                Please specify:
              </label>
              <input
                type="text"
                placeholder="Tell us more about your reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                 text-xs sm:text-sm placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Acknowledgment checkbox */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={() => setAcknowledged(!acknowledged)}
              className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
              disabled={isLoading}
            />
            <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">
              I understand that my account will be temporarily disabled and I
              can reactivate it by logging back in at any time.
            </span>
          </label>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            disabled={
              !acknowledged ||
              !reason ||
              (reason === "Other" && !otherReason.trim()) ||
              isLoading
            }
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
              acknowledged &&
              reason &&
              (reason !== "Other" || otherReason.trim()) &&
              !isLoading
                ? "bg-red-400 hover:bg-red-500 text-white"
                : "bg-red-200 text-red-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Deactivating..." : "Deactivate Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
