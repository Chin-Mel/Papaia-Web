import { X, CheckCircle, Leaf, MapPin, Users, TrendingUp } from "lucide-react";

export default function FarmAddedSuccessModal({
  onClose,
  onViewDashboard,
  onAddAnother,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";

      return () => {
        document.body.style.overflow = "unset";
        document.body.style.pointerEvents = "auto";
      };
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] rounded-t-lg p-6 relative">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Farm Successfully Added!
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
          <p className="text-gray-800 mb-6">
            Your new farm has been registered and is now ready for management.
            You can start adding farmers and tracking your farm.
          </p>

          {/* Farm Details Card */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Farm Icon */}
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>

              {/* Farm Details */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">Green Valley Farm</h3>
                <p className="text-sm text-gray-600">Farm ID: #FRM-2024-001</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-green-600" />
                  <span className="text-sm text-gray-600">California, USA</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">What's Next?</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-gray-800">Invite team members</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-800">
                  Set up monitoring and analytics
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onViewDashboard}
              className="flex-1 bg-[#FF8C42] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#F97316] transition-colors"
            >
              View Farm Dashboard
            </button>
            <button
              onClick={onAddAnother}
              className="flex-1 border border-[#FF8C42] text-[#FF8C42] font-bold py-3 px-4 rounded-lg hover:bg-[#FF8C42] hover:text-white transition-colors"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
