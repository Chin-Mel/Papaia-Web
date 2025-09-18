import { X, CheckCircle, ArrowLeft, User } from "lucide-react";

function FarmerRemovedSuccessModal({ isOpen, onClose, farmer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Farmer Removed Successfully
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            The farmer has been successfully removed from the farm management
            system. All associated data and permissions have been updated.
          </p>

          {farmer && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {farmer.firstname || farmer.firstName}{" "}
                    {farmer.lastname || farmer.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Farmer ID: {farmer.id || farmer.farmerId}
                  </p>
                  <p className="text-gray-600 text-sm">Email: {farmer.email}</p>
                </div>
                <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                  Removed
                </span>
              </div>
            </div>
          )}

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

export default FarmerRemovedSuccessModal;
