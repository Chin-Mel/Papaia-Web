import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function PasswordUpdatedSuccessModal({
  isOpen,
  onContinueToSignIn,
  onBackToHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-start min-h-screen px-4 pt-24 sm:pt-28 pb-6">
      <div className="w-full max-w-lg sm:max-w-xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-7 sm:py-9 px-4"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Logo"
              className="w-9 h-11 sm:w-11 sm:h-14"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 py-7 sm:py-9">
          <p className="text-gray-600 text-center mb-8 text-sm sm:text-base leading-relaxed">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={onContinueToSignIn}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg shadow-md hover:shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              Continue to Sign in
            </button>

            <button
              onClick={onBackToHome}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 sm:py-3.5 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-base sm:text-lg shadow-sm hover:shadow-md"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
