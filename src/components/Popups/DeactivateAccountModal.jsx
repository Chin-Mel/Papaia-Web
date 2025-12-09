import { useState, useRef, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAlert } from "../../AlertContext";
import { useNavigate } from "react-router-dom";

export default function DeactivateAccountModal({ isOpen, onClose }) {
  const { showAlert } = useAlert();
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDeactivate = async () => {
    if (!acknowledged) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/deactivate",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        if (window.refreshActivities) {
          window.refreshActivities();
        }

        showAlert("success", "Account deactivated successfully!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/sign-in");
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

        showAlert("error", errorMessage);
      }
    } catch (error) {
      showAlert(
        "error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setOtherReason("");
    setAcknowledged(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Deactivate Account
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-6 space-y-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Deactivating your account will temporarily disable your
                  profile and farm access. You can reactivate anytime by logging
                  back in.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gray-800 font-semibold text-base block">
                Reason for Deactivation
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
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="deactivateReason"
                    value={item}
                    checked={reason === item}
                    onChange={() => setReason(item)}
                    className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-400 focus:ring-2"
                  />
                  <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={() => setAcknowledged(!acknowledged)}
                className="mt-0.5 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400 focus:ring-2"
                disabled={isLoading}
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                I understand that my account will be temporarily disabled and I
                can reactivate it by logging back in at any time.
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            disabled={!acknowledged || isLoading}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              acknowledged && !isLoading
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Deactivating...
              </>
            ) : (
              "Deactivate Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
