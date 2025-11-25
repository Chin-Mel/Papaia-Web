import { useState, useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { FiInfo } from "react-icons/fi";

export default function OtpVerificationModal({ email, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Please enter the full 4-digit OTP.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: enteredOtp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("OTP verified successfully!");
        onSuccess(data.userId);
      } else {
        setError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");

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

      if (response.ok) {
        alert("A new OTP has been sent to your email.");
        setCountdown(60);
        setOtp(["", "", "", ""]);
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-12">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
        <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
              <img
                src={PapayaLogo}
                alt="Papaia Logo"
                className="w-7 h-9"
                loading="eager"
                decoding="async"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Email Authentication
            </h2>
            <p className="text-sm sm:text-base text-white/90 text-center mb-1">
              A one-time password has been sent to
            </p>
            <p className="text-base sm:text-lg font-semibold text-white">
              {email}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <p className="text-base sm:text-lg text-center text-[#00712D] mb-8 font-medium">
              Enter the 4 digit code to continue
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-semibold border-2 border-[#8B4513] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg transition-all"
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Countdown/Resend */}
            <div className="mb-6 text-center">
              {countdown > 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">
                  Resend code in{" "}
                  <span className="font-semibold">{formatTime(countdown)}</span>
                </p>
              ) : (
                <p className="text-sm sm:text-base text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Try Again
                  </button>
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isLoading || isResending}
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-3.5 rounded-lg shadow-lg transition-all duration-200 text-base sm:text-lg mb-6 ${
                isLoading || isResending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              <FaSignInAlt className="w-5 h-5" />
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            {/* Security Reminder */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-3">
              <FiInfo className="mt-0.5 flex-shrink-0 w-5 h-5 text-blue-600" />
              <div className="text-sm sm:text-base">
                <p className="font-bold mb-1">Security Reminder</p>
                <p className="text-blue-700">
                  Never share your OTP codes with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
