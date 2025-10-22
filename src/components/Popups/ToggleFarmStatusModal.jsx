import { useState, useEffect, useRef } from "react";
import {
  X,
  ToggleLeft,
  ToggleRight,
  Leaf,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

function ToggleFarmStatusModal({ isOpen, onClose, farmData, onStatusToggled }) {
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleToggleStatus = async () => {
    if (!farmData) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://papaiaapi.onrender.com/api/owner/farm/status/${farmData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Clear cache to force refresh in Dashboard
        if (window.clearFarmCache) {
          window.clearFarmCache();
        }

        // Refresh activities immediately
        if (window.refreshActivities) {
          window.refreshActivities();
        }

        // Call the callback to update parent component
        if (onStatusToggled) {
          onStatusToggled(data.newStatus);
        }
        onClose();
      } else {
        throw new Error(data.message || "Failed to toggle farm status");
      }
    } catch (error) {
      console.error("Error toggling farm status:", error);
      alert(`Failed to toggle farm status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !farmData) return null;

  const isActive = farmData.status === "active";
  const newStatus = isActive ? "inactive" : "active";
  const actionText = isActive ? "Deactivate" : "Activate";
  const actionColor = isActive ? "red" : "green";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-4 sm:p-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
              {isActive ? (
                <ToggleRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              ) : (
                <ToggleLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {actionText} Farm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Farm Details */}
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                  {farmData.farmName}
                </h3>
                <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm mb-2">
                  <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span className="truncate">
                    {farmData.location || "No location specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Status:
                  </span>
                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    )}
                    <span
                      className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Change Information */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
              What happens when you {actionText.toLowerCase()}?
            </h4>

            {isActive ? (
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Farmers can't make new scans</li>
                <li>• Hidden from active farm lists</li>
                <li>• Data and analytics preserved</li>
                <li>• Can reactivate anytime</li>
              </ul>
            ) : (
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Farmers can make scans again</li>
                <li>• Appears in active farm lists</li>
                <li>• Previous data remains accessible</li>
                <li>• Analytics resume updating</li>
              </ul>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-gray-800 font-medium text-sm sm:text-base">
              {actionText} this farm?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              This action can be reversed anytime.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
              actionColor === "red"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isActive ? (
                  <ToggleLeft className="w-4 h-4" />
                ) : (
                  <ToggleRight className="w-4 h-4" />
                )}
                {actionText} Farm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToggleFarmStatusModal;
