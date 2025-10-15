import { useState, useEffect } from "react";
import {
  X,
  UserMinus,
  AlertTriangle,
  Ban,
  User,
  Leaf,
  Loader2,
  EyeOff,
} from "lucide-react";

function RemoveFarmerModal({ isOpen, onClose, onConfirmRemove, farmer }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // 👇 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleConfirmRemove = async () => {
    if (confirmationText.toUpperCase() === "REMOVE") {
      setIsLoading(true);
      try {
        await onConfirmRemove();
      } catch (error) {
        console.error("Error removing farmer:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Fixed field name handling - API returns lowercase field names
  const getFullName = (farmer) => {
    if (!farmer) return "Unknown Farmer";

    return (
      [
        farmer.firstname || farmer.firstName || "",
        farmer.middlename || farmer.middleName || "",
        farmer.lastname || farmer.lastName || "",
        farmer.suffix || "",
      ]
        .filter(Boolean)
        .join(" ") || "Unknown Farmer"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center">
              {farmer?.profilePicture ? (
                <img
                  src={farmer.profilePicture}
                  alt="Farmer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="text-white">
              <h2 className="text-lg font-semibold leading-tight">
                {getFullName(farmer)}
              </h2>
              <p className="text-sm opacity-80">🌱 Farm Management System</p>
            </div>
            <span className="ml-auto px-2 py-1 text-xs bg-white text-green-600 rounded-full font-medium">
              {farmer?.status?.charAt(0).toUpperCase() +
                farmer?.status?.slice(1) || "Active"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Are you sure you want to remove this farmer?
              </p>
              <p className="text-sm text-gray-700">
                This action cannot be undone and will have the following
                consequences:
              </p>
            </div>
          </div>

          {/* Consequence Cards */}
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="font-semibold text-red-700 mb-1">
                  Access Revoked:
                </p>
                <p className="text-sm text-red-600">
                  Farmer will lose access to report farm scans
                </p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <Ban className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="font-semibold text-red-700 mb-1">Data Loss:</p>
                <p className="text-sm text-red-600">
                  All pending reports and analytics will be lost
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div>
            <p className="text-sm text-gray-800 font-medium mb-2">
              Type <span className="font-bold">"REMOVE"</span> to confirm this
              action:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type REMOVE here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRemove}
            disabled={confirmationText.toUpperCase() !== "REMOVE" || isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <UserMinus className="w-4 h-4" />
                Remove Farmer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveFarmerModal;
