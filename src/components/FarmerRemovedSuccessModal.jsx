import { X, CheckCircle, ArrowLeft } from "lucide-react";

export default function FarmerRemovedSuccessModal({ isOpen, onClose, farmer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] rounded-t-lg p-6 relative">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Farmer Removed Successfully
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Confirmation Message */}
          <p className="text-gray-700 mb-6">
            The farmer has been successfully removed from the farm management
            system. All associated data and permissions have been updated.
          </p>

          {/* Farmer Details Card */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <img
                src="https://source.unsplash.com/60x60/?man,portrait"
                alt="John Mitchell"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Farmer Information */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">John Mitchell</h3>
                <p className="text-gray-600 text-sm mb-1">
                  Farmer ID: #FM-2024-0156
                </p>
                <p className="text-gray-600 text-sm">
                  Farm: Green Valley Organic Farm
                </p>
              </div>

              {/* Status Badge */}
              <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                Removed
              </span>
            </div>
          </div>

          {/* Confirmation Points */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Access permissions revoked</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Historical data archived</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
