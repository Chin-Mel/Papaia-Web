import { useState } from "react";
import {
  X,
  UserMinus,
  AlertTriangle,
  Ban,
  TrendingDown,
  Leaf,
} from "lucide-react";

export default function RemoveFarmerModal({
  isOpen,
  onClose,
  onConfirmRemove,
  farmer,
}) {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirmRemove = () => {
    if (confirmationText === "REMOVE") {
      onConfirmRemove();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A7C59] rounded-lg flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Remove Farmer</h2>
              <p className="text-white/80 text-sm">Remove Farmer from a farm</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Farmer Information Section */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <img
                src="https://source.unsplash.com/60x60/?man,portrait"
                alt="John Martinez"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Farmer Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-gray-800">John Martinez</h3>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Leaf className="w-3 h-3 text-green-600" />
                  Green Valley Farm
                </div>
              </div>
            </div>
          </div>

          {/* Warning/Confirmation Message */}
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-bold text-gray-800 mb-2">
                Are you sure you want to remove this farmer?
              </p>
              <p className="text-gray-700">
                This action cannot be undone and will have the following
                consequences:
              </p>
            </div>
          </div>

          {/* Consequences Section */}
          <div className="space-y-3">
            {/* First Consequence - Access Revoked */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                  <Ban className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-red-700 mb-1">Access Revoked:</p>
                  <p className="text-red-600 text-sm">
                    Farmer will lose access to report farm scans
                  </p>
                </div>
              </div>
            </div>

            {/* Second Consequence - Data Loss */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                  <TrendingDown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-red-700 mb-1">Data Loss:</p>
                  <p className="text-red-600 text-sm">
                    All pending reports and analytics will be lost
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input Field */}
          <div>
            <p className="text-gray-800 font-medium mb-2">
              Type "REMOVE" to confirm this action:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type REMOVE here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleConfirmRemove}
            disabled={confirmationText !== "REMOVE"}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserMinus className="w-4 h-4" />
            Remove Farmer
          </button>
        </div>
      </div>
    </div>
  );
}
