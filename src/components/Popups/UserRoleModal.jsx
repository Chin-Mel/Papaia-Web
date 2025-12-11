import { User, Sprout, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRoleModal({ isOpen, onSelect }) {
  const navigate = useNavigate();
  const [showAppModal, setShowAppModal] = useState(false);

  if (!isOpen) return null;

  const handleOwnerClick = () => {
    onSelect("owner");
    navigate("/sign-up");
  };

  const handleFarmerClick = () => {
    setShowAppModal(true);
  };

  const handleBack = () => {
    setShowAppModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("papaia.app/farm/abc123xyz");
    alert("Link copied to clipboard!");
  };

  if (showAppModal) {
    return (
      <div className="fixed inset-0 z-50 pt-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#2D5016]">
              Install our App
            </h2>
            <button
              onClick={() => setShowAppModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
            To start using Papaia and access all farmer features, install the
            Papaia mobile app. Scan the QR code or use the join link below.
          </p>

          <div className="bg-gray-100 rounded-xl p-4 mb-3 flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white border-4 border-black flex items-center justify-center">
                <div className="text-xs font-mono">QR CODE</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">Papaia App's QR Code</p>
          </div>

          <div className="flex items-center gap-4 my-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="bg-gray-100 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Papaia App Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white px-3 py-2 rounded-lg text-xs text-gray-700 border">
                papaia.app/farm/abc123xyz
              </div>
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 text-xs"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 pt-16 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-3xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 relative">
        <button
          onClick={handleGoBack}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D5016] mb-2">
            Welcome to Papaia
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Choose your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border-3 border-orange-400 p-5 sm:p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#2D5016] mb-2 sm:mb-3">
              I am a Farm Owner
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Manage your farm operations and team
            </p>

            <button
              onClick={handleOwnerClick}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm sm:text-base"
            >
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-2xl border-3 border-green-600 p-5 sm:p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#2D5016] mb-2 sm:mb-3">
              I am a Farmer
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Join your farm team and track activities
            </p>

            <button
              onClick={handleFarmerClick}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm sm:text-base"
            >
              Join Farm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
