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
  AlertTriangle,
} from "lucide-react";

export default function ToggleFarmStatusModal({
  isOpen,
  onClose,
  farmData,
  onStatusToggled,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Capture the initial status when modal opens
  const [initialStatus, setInitialStatus] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && farmData) {
      // Capture the status when modal opens
      setInitialStatus(farmData.status);
    }
    if (!isOpen) {
      setIsLoading(false);
      setInitialStatus(null);
    }
  }, [isOpen, farmData]);

  const handleToggleStatus = async () => {
    if (!farmData) return;
    setIsLoading(true);
    const wasActive = initialStatus === "active";

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
        // Close immediately on success
        onClose();

        // Clear cache and refresh
        if (window.clearFarmCache) window.clearFarmCache();
        if (window.refreshActivities) window.refreshActivities();

        // Notify parent with new status
        if (onStatusToggled) {
          onStatusToggled(data.newStatus);
        }
      } else {
        throw new Error(data.message || "Failed to toggle farm status");
      }
    } catch (error) {
      // On error, keep modal open and show error in parent
      onClose();
      if (onStatusToggled) {
        onStatusToggled(null, error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !farmData || !initialStatus) return null;

  // Use the captured initial status for consistent UI
  const isActive = initialStatus === "active";
  const actionText = isActive ? "Deactivate" : "Reactivate";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-green-700 to-orange-500 rounded-t-2xl p-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              {isActive ? (
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {actionText} Farm
              </h2>
              <p className="text-white/90 text-sm">
                {isActive ? "Temporarily disable farm" : "Enable this farm"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-1.5"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-4 space-y-3">
            <div className="bg-green-50 rounded-xl p-3 border-2 border-green-200">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base truncate">
                    {farmData.farmName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-1.5">
                    <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="truncate">
                      {farmData.location || "No location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-medium">
                      Status:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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

            <div
              className={`rounded-xl p-3 border-2 ${
                isActive
                  ? "bg-amber-50 border-amber-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <h4
                className={`font-bold mb-2 flex items-center gap-2 text-sm ${
                  isActive ? "text-amber-900" : "text-green-900"
                }`}
              >
                {isActive ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                What happens?
              </h4>
              <ul
                className={`space-y-1.5 text-xs ${
                  isActive ? "text-amber-800" : "text-green-800"
                }`}
              >
                {isActive ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Farmers can't make new scans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Hidden from active farm lists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Data preserved and accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Can reactivate anytime</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Farmers can make scans again</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Appears in active farm lists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Previous data remains accessible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Analytics resume updating</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="p-4 border-t-2 border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-2.5 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={`flex-1 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isActive ? "Deactivating" : "Reactivating"}
                </>
              ) : (
                <>
                  {isActive ? (
                    <ToggleLeft className="w-5 h-5" />
                  ) : (
                    <ToggleRight className="w-5 h-5" />
                  )}
                  {actionText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
