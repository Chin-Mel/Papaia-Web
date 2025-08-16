import { useState } from "react";
import { X, AlertTriangle, Leaf, MapPin, Check, Trash2 } from "lucide-react";

export default function DeleteFarmModal({
  isOpen,
  onClose,
  onConfirmDelete,
  farm,
}) {
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirmDelete = () => {
    if (confirmationText === "DELETE") {
      onConfirmDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete Farm</h2>
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
          {/* Farm Information Card */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {/* Farm Icon */}
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>

              {/* Farm Info */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">
                  Green Valley Farm
                </h3>
                <p className="text-gray-700 text-sm mb-1">#FRM-2024-001</p>
                <div className="flex items-center gap-1 text-gray-700 text-sm">
                  <MapPin className="w-3 h-3 text-green-600" />
                  California, USA
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div>
            <p className="text-gray-800 font-medium">
              Are you sure you want to delete{" "}
              <span className="font-bold">Green Valley Farm</span>? This action
              cannot be undone and will permanently remove:
            </p>
          </div>

          {/* Consequences List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-500" />
              <span className="text-gray-800">
                Access to analytics and relevant information
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-500" />
              <span className="text-gray-800">All scan results and alerts</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-500" />
              <span className="text-gray-800">
                Farmer access to subscriptions (if applicable)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-red-500" />
              <span className="text-gray-800">
                All assigned farmer accounts for this farm
              </span>
            </div>
          </div>

          {/* Confirmation Input Field */}
          <div>
            <p className="text-gray-800 font-bold mb-2">
              Type <span className="font-bold">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={confirmationText !== "DELETE"}
            className="px-6 py-3 bg-red-300 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Farm
          </button>
        </div>
      </div>
    </div>
  );
}
