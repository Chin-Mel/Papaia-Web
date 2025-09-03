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
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-auto">
        {/* Header Section with Gradient */}
        <div
          className="flex flex-col items-center justify-center text-white pt-6 pb-3 rounded-t-2xl"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          {/* Icon */}
          <div
            className="rounded-full p-4 shadow-lg mb-4 flex items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(to right, #2E7D32, #14B8A6)",
            }}
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-8">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Continue to Sign in */}
            <button
              onClick={onContinueToSignIn}
              className="transition-all duration-150 active:scale-95 active:shadow-inner w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              Continue to Sign in
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back to Home */}
            <button
              onClick={onBackToHome}
              className="transition-all duration-150 active:scale-95 active:shadow-inner w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
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
