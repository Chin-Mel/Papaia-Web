import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function PasswordUpdatedSuccessModal({
  isOpen,
  onClose,
  onContinueToSignIn,
  onBackToHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#4A7C59] to-[#FF8C42] rounded-t-lg p-6 relative">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {/* Descriptive Text */}
          <p className="text-gray-700 text-center mb-8">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Continue to Sign in Button */}
            <button
              onClick={onContinueToSignIn}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              Continue to Sign in
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back to Home Button */}
            <button
              onClick={onBackToHome}
              className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
