import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PasswordUpdatedSuccessModal({
  isOpen,
  onContinueToSignIn,
  onBackToHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4 py-6">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-5 px-4"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 ring-4 ring-white/30">
            <img src={PapayaLogo} alt="Logo" className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-600 text-center mb-5 text-sm">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onContinueToSignIn}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Continue to Sign in
            </button>

            <button
              onClick={onBackToHome}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
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
