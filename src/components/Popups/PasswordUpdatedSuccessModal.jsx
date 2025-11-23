import { ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PasswordUpdatedSuccessModal({ isOpen }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)] bg-white">
        {/* Top Gradient */}
        <div
          className="flex flex-col items-center justify-center text-white py-6"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-7 h-9"
              loading="eager"
              decoding="async"
            />
          </div>

          <h2 className="text-xl font-semibold tracking-wide">
            Password Updated Successfully
          </h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-center text-gray-700 mb-8 leading-relaxed">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Sign In */}
            <button
              onClick={() => navigate("/sign-in")}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Continue to Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Home */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
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
