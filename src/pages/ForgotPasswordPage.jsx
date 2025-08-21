import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Header from "../components/Header/HeaderStart";
import heroBg from "../assets/hero-background.png";
import OtpVerificationModal from "../components/Popups/OtpVerificationModal";
import NewPasswordModal from "../components/Popups/NewPasswordModal";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
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
      console.error("Forgot password error:", err);
      setError("Failed to connect to server.");
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute top-1/2 left-1/2 w-[750px] h-[550px] backdrop-blur-sm -translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
          <div
            className="flex flex-col items-center justify-center text-white p-6"
            style={{
              backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
            }}
          >
            <div className="bg-white rounded-full p-4 shadow-lg mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="orange"
                viewBox="0 0 24 24"
                stroke="orange"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Forgot Password</h2>
            <p className="text-sm text-center opacity-90 mt-1">
              You will receive an email with a one-time password
            </p>
          </div>

          <div className="bg-white p-6">
            <form onSubmit={handleSubmit}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MdEmail className="text-[#FF8C42] text-lg" /> Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmailFormat(e.target.value);
                }}
                className="w-full px-4 py-2 border-2 mt-1 border-[#E5E7EB] placeholder-[#ADAEBC] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {emailFormatError && (
                <p className="text-red-500 text-sm mt-1">{emailFormatError}</p>
              )}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button
                type="submit"
                className="mt-6 w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #F0820B, #F97316)",
                }}
              >
                <FaSignInAlt className="w-5 h-5" /> Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpVerificationModal
          email={email}
          onVerified={(userId) => {
            setVerifiedUserId(userId);
            setShowOtpModal(false);
            setShowNewPasswordModal(true);
          }}
        />
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && verifiedUserId && (
        <NewPasswordModal
          userId={verifiedUserId}
          asModal={true}
          onClose={() => setShowNewPasswordModal(false)}
        />
      )}
    </>
  );
}
