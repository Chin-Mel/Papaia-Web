import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function LogoutModal({ isOpen, onClose, onConfirmLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen && !isLoggingOut) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isLoggingOut]);

  // Reset loading state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoggingOut(false);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onConfirmLogout();
      // Modal will close when redirect happens
    } catch (error) {
      // If logout fails, reset loading state
      setIsLoggingOut(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Prevent closing if logging out
    if (e.target === e.currentTarget && !isLoggingOut) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex bg-black/50 items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isLoggingOut ? "bg-orange-100" : "bg-red-100"
            }`}
          >
            {isLoggingOut ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            ) : (
              <LogOut className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </h2>
          <p className="text-gray-600">
            {isLoggingOut
              ? "Please wait while we securely log you out of your account."
              : "Are you sure you want to sign out of your account? You'll need to sign in again to access your dashboard."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
