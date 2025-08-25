import { X, CheckCircle, ArrowLeft, User } from "lucide-react";

function FarmerAddedSuccessModal({ isOpen, onClose, farmer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#F97316] p-8 relative text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-md mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Farmer Added Successfully
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Your new farmer is now active in the system
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {farmer && (
            <div className="bg-green-50 rounded-xl p-5 flex items-center gap-4 shadow-sm mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {farmer.firstName} {farmer.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{farmer.email}</p>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                Active
              </span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#F97316] text-white rounded-lg font-bold hover:from-[#F97316] hover:to-[#FF8C42] transition-all flex items-center gap-2"
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
