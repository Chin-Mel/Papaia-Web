import { X, CheckCircle, ArrowLeft, User } from "lucide-react";

function FarmerAddedSuccessModal({ isOpen, onClose, farmer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-600 to-orange-500 rounded-t-lg p-6 relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Farmer Added Successfully
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">
            The farmer has been successfully added to your farm team. They can
            now access the farm management system.
          </p>

          {farmer && (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {farmer.firstName} {farmer.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">Email: {farmer.email}</p>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                  Active
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerAddedSuccessModal;
