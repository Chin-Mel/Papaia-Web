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

    // Simulate API call
    setTimeout(() => {
      alert("OTP verified successfully!");
      onSuccess("user123");
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");

    setTimeout(() => {
      alert("A new OTP has been sent to your email.");
      setCountdown(60);
      setOtp(["", "", "", ""]);
      setIsResending(false);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-start min-h-screen px-4 pt-16 sm:pt-20 pb-6">
      <div className="w-full max-w-sm sm:max-w-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.15)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-8 sm:py-10 px-4"
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
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Email Authentication
          </h2>
          <p className="text-sm sm:text-base opacity-90 text-center mb-1">
            A one-time password has been sent to
          </p>
          <p className="text-base sm:text-lg font-semibold">{email}</p>
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
  );
}
