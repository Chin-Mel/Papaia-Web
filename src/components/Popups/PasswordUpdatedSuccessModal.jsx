import { ArrowRight, Home } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

export default function PasswordUpdatedSuccessModal({
  isOpen,
  onContinueToSignIn,
  onBackToHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-start min-h-screen px-4 pt-16 sm:pt-20 pb-6">
      <div className="w-full max-w-sm sm:max-w-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.15)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-6 sm:py-7 px-4"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 sm:mb-4 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Logo"
              className="w-8 h-10 sm:w-9 sm:h-11"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-6 py-6 sm:py-7">
          <p className="text-gray-600 text-center mb-6 sm:mb-7 text-sm sm:text-base leading-relaxed">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={onContinueToSignIn}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              Continue to Sign in
            </button>

            <button
              onClick={onBackToHome}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm hover:shadow-md"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
