import { useState, useEffect } from "react";
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
        // Call the callback to refresh farm data in parent component
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              {isActive ? (
                <ToggleRight className="w-5 h-5 text-green-500" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{actionText} Farm</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Farm Details */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">
                  {farmData.farmName}
                </h3>
                <div className="flex items-center gap-1 text-gray-700 text-sm mb-2">
                  <MapPin className="w-3 h-3 text-green-600" />
                  {farmData.location || "No location specified"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <div className="flex items-center gap-1">
                    {isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">
              What happens when you {actionText.toLowerCase()} this farm?
            </h4>

            {isActive ? (
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Farmers will no longer be able to make new scans</li>
                <li>• The farm will be hidden from active farm lists</li>
                <li>• Existing data and analytics will be preserved</li>
                <li>• You can reactivate the farm anytime</li>
              </ul>
            ) : (
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Farmers will be able to make scans again</li>
                <li>• The farm will appear in active farm lists</li>
                <li>• All previous data will remain accessible</li>
                <li>• Analytics will resume updating with new scans</li>
              </ul>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-gray-800 font-medium">
              Are you sure you want to {actionText.toLowerCase()} this farm?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              This action can be reversed at any time.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
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
