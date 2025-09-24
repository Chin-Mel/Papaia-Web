import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isDeleteEnabled = confirmText === "DELETE";

  const handleCancel = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  const handleDelete = async () => {
    if (!isDeleteEnabled || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user.id) {
        setError("Authentication required. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Since the API doesn't have a specific delete endpoint, we'll use a user update
      // to mark the account as deleted (this would need backend implementation)
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/user/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Account deleted successfully. You will be logged out.");

        // Clear localStorage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        handleCancel();
        window.location.href = "/login";
      } else {
        const data = await response.json();
        if (response.status === 401) {
          setError("Authentication expired. Please log in again.");
        } else if (response.status === 404) {
          setError("Account not found.");
        } else if (response.status === 403) {
          setError("You don't have permission to delete this account.");
        } else {
          setError(data.error || data.message || "Failed to delete account");
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-white font-semibold text-lg">Delete Account</h2>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-sm leading-relaxed">
                <strong>Warning:</strong> Deleting your account is permanent and
                cannot be undone. This action will permanently remove all your
                data from our servers.
              </p>
            </div>
          </div>

          {/* What will be lost */}
          <div>
            <h3 className="text-gray-900 font-medium mb-4">
              What will be permanently deleted:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  All farm data and analytics
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Scan history and treatment records
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Profile information and preferences
                </span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Account access and login credentials
                </span>
              </li>
            </ul>
          </div>

          {/* Final confirmation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 text-sm mb-3">
              This action cannot be reversed. Are you absolutely sure you want
              to delete your account?
            </p>
            <p className="text-gray-700 text-sm mb-3">
              If you're having issues, consider reaching out to our support team
              first.
            </p>
          </div>

          {/* Confirmation Input */}
          <div>
            <p className="text-gray-700 text-sm mb-3">
              To confirm deletion, type{" "}
              <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                DELETE
              </span>{" "}
              in the box below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
            {confirmText && confirmText !== "DELETE" && (
              <p className="text-red-500 text-xs mt-1">
                Please type exactly "DELETE" to confirm
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isDeleteEnabled || isLoading}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
              isDeleteEnabled && !isLoading
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}
