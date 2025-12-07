// ForgotPasswordPage.jsx - Optimized Version
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import HeaderStart from "../components/Header/HeaderStart";
import FooterStart from "../components/Footer/FooterStart";
import MainBackground from "../assets/MainBackground.png";
import PapayaLogo from "../assets/ic_papaia_logo_no_word.png";
import OtpVerificationModal from "../components/Popups/OtpVerificationModal";
import NewPasswordModal from "../components/Popups/NewPasswordModal";
import { useAlert } from "../AlertContext";

export default function ForgotPasswordPage() {
  const { showAlert } = useAlert();

  // Form state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [verifiedUserId, setVerifiedUserId] = useState(null);

  // Email validation
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  // Get border class based on validation
  const getBorderClass = () => {
    if (touched && !email.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  // Handle field blur
  const handleBlur = () => {
    setTouched(true);
  };

  // Handle field change
  const handleEmailChange = (value) => {
    setEmail(value);
    if (touched) {
      setTouched(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark as touched
    setTouched(true);

    const trimmedEmail = email.trim();

    // Validate required field
    if (!trimmedEmail) {
      showAlert("error", "Please fill in the required field.");
      return;
    }

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      showAlert("error", "Invalid email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showAlert("success", "OTP Sent. Please check your Email!");
        setShowOtpModal(true);
      } else {
        // Handle specific error cases
        if (
          data?.message?.toLowerCase().includes("farmer") ||
          data?.role === "farmer"
        ) {
          showAlert("error", "Email is a farmer email.");
        } else if (
          data?.message?.toLowerCase().includes("not found") ||
          data?.message?.toLowerCase().includes("does not exist")
        ) {
          showAlert("error", "Email does not exist.");
        } else {
          showAlert(
            "error",
            data.message || "Failed to send OTP. Please try again."
          );
        }
      }
    } catch (err) {
      showAlert(
        "error",
        "Failed to connect to server. Please check your connection and try again."
      );
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
        {!showOtpModal && !showNewPasswordModal && (
          <div className="relative z-10 w-full max-w-md mx-auto mt-16 sm:mt-20 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Header */}
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
                  className="w-7 h-9 object-contain"
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center">
                Forgot Password
              </h2>
              <p className="text-sm sm:text-base text-center opacity-90 mt-1">
                You will receive an email with a one-time pin.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <MdEmail className="text-[#FF8C42] text-lg" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={handleBlur}
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all ${getBorderClass()}`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          </div>
        )}

        {/* OTP Verification Modal */}
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
              showAlert(
                "success",
                "Password Updated Successfully. You can now login using your new password."
              );
              window.location.href = "/sign-in";
            }}
          />
        )}
      </div>

      <FooterStart />
    </>
  );
}
