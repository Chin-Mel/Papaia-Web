import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PasswordUpdatedSuccessModal({ isOpen }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="relative w-full max-w-md mx-auto my-20 rounded-2xl shadow-lg overflow-auto bg-white">
      {/* Top Gradient Section */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Top Gradient Section */}
        <div
          className="flex flex-col items-center justify-center text-white pt-6 pb-3"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div
            className="rounded-full p-4 shadow-lg mb-4 flex items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(to right, #2E7D32, #14B8A6)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Password Updated Successfully</h2>
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
              onClick={() => navigate("/sign-in")}
              className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              Continue to Sign in
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Back to Home Button */}
            <button
              onClick={() => navigate("/")}
              className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
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
