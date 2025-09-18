import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeactivateAccountModal() {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const handleDeactivate = () => {
    if (!acknowledged) return;
    const selectedReason = reason === "Other" ? otherReason : reason;
    console.log("Deactivation Reason:", selectedReason);
    // TODO: Call API to deactivate
    // Reset form
    setReason("");
    setOtherReason("");
    setAcknowledged(false);
  };

  const handleClose = () => {
    // Reset form
    setReason("");
    setOtherReason("");
    setAcknowledged(false);
  };

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
            {[
              "I no longer use the app",
              "I want to take a break",
              "Privacy concerns",
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
                  className="appearance-none w-4 h-4 sm:w-5 sm:h-5
                   border-2 border-gray-300 rounded-full
                   checked:bg-orange-500 checked:border-orange-500
                   focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-0"
                />
                <span className="text-gray-700 text-xs sm:text-sm group-hover:text-gray-900 transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>

          {/* Other reason input */}
          {reason === "Other" && (
            <input
              type="text"
              placeholder="Please specify..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
               text-xs sm:text-sm placeholder-gray-400 mt-2 sm:mt-3"
            />
          )}

          {/* Acknowledgment checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={() => setAcknowledged(!acknowledged)}
              className="peer sr-only" // hides the actual checkbox
            />
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded 
                  peer-checked:bg-orange-500 flex items-center justify-center"
            >
              <svg
                className="hidden peer-checked:block w-3 h-3 sm:w-4 sm:h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">
              I understand my account will be hidden until I reactivate.
            </span>
          </label>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            disabled={!acknowledged}
            className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
              acknowledged
                ? "bg-red-400 hover:bg-red-500 text-white"
                : "bg-red-200 text-red-400 cursor-not-allowed"
            }`}
          >
            <span className="hidden xs:inline">Deactivate Account</span>
            <span className="xs:hidden">Deactivate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
