import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";
import MainBackground from "../assets/MainBackground.png";
import PapayaLogo from "../assets/ic_papaia_logo_no_word.png";
import OtpVerificationModal from "../components/Popups/OtpVerificationModal";
import NewPasswordModal from "../components/Popups/NewPasswordModal";
import PasswordUpdatedSuccessModal from "../components/Popups/PasswordUpdatedSuccessModal";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showPasswordUpdated, setShowPasswordUpdated] = useState(false);
  const [verifiedUserId, setVerifiedUserId] = useState(null);

  const validateEmailFormat = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailFormatError(
      !regex.test(value.trim()) ? "Please enter a valid email address." : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || emailFormatError) {
      setError("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) setShowOtpModal(true);
      else setError(data.message || "Email not found or invalid.");
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderStart />

      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 sm:px-6"
        style={{ backgroundImage: `url(${MainBackground})` }}
      >
        {/* Forgot Password Form */}
        {!showOtpModal && !showNewPasswordModal && !showPasswordUpdated && (
          <div className="relative z-10 w-full max-w-lg sm:max-w-md mx-auto mt-18 sm:mt-20 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden">
            <div
              className="flex flex-col items-center justify-center text-white p-6"
              style={{
                backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
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

              <h2 className="text-xl sm:text-2xl font-bold text-center">
                Forgot Password
              </h2>
              <p className="text-sm sm:text-base text-center opacity-90 mt-1">
                You will receive an email with a one-time pin.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 flex flex-col">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <MdEmail className="text-[#FF8C42] text-lg" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmailFormat(e.target.value);
                }}
                autoComplete="email"
                className={`transition-all duration-150 w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  error || emailFormatError
                    ? "border-red-500"
                    : "border-[#E5E7EB]"
                }`}
              />

              <div className="min-h-[20px] mt-2">
                {emailFormatError && (
                  <p className="text-red-500 text-sm">{emailFormatError}</p>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer mt-5 w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed bg-orange-500"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                <FaSignInAlt className="w-5 h-5" />
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          </div>
        )}

        {/* OTP Modal */}
        {showOtpModal && (
          <OtpVerificationModal
            email={email}
            onSuccess={(userId) => {
              setVerifiedUserId(userId);
              setShowOtpModal(false);
              setShowNewPasswordModal(true);
            }}
          />
        )}

        {/* New Password Modal */}
        {showNewPasswordModal && verifiedUserId && (
          <NewPasswordModal
            user_Id={verifiedUserId}
            onPasswordSaved={() => {
              setShowNewPasswordModal(false);
              setShowPasswordUpdated(true); // now this will trigger
            }}
          />
        )}

        {/* Password Updated Modal */}
        {showPasswordUpdated && (
          <PasswordUpdatedSuccessModal
            isOpen={showPasswordUpdated}
            onContinueToSignIn={() => (window.location.href = "/sign-in")}
            onBackToHome={() => (window.location.href = "/")}
          />
        )}
      </div>

      <FooterStart />
    </>
  );
}
