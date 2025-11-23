import { useState, useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { FiInfo } from "react-icons/fi";

export default function OtpVerificationModal({ email, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(150); // 10 minutes
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await fetch("https://papaiaapi.onrender.com/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP verified successfully!");
        setTimeout(() => {
          if (typeof onSuccess === "function") onSuccess(data.userId);
        }, 500);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");
    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("A new OTP has been sent to your email.");
        setCountdown(60);
        setOtp(["", "", "", ""]);
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    }
    setIsResending(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Modal box */}
      <div className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-8 px-6"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img
              src={PapayaLogoImage}
              alt="Papaia Logo"
              className="w-7 h-9"
              loading="eager"
              decoding="async"
            />
          </div>
          <h2 className="text-2xl font-bold mb-1">Email Authentication</h2>
          <h4 className="text-base font-semibold mb-3">
            Enter one-time password
          </h4>
          <p className="text-sm text-center opacity-95 mb-1">
            A one-time password has been sent to
          </p>
          <p className="text-sm text-center font-bold">{email}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Instructions */}
          <p className="text-base text-center text-[#00712D] mb-8">
            Enter the 4 digit code we sent you via email to continue.
          </p>

          {/* OTP Inputs */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl transition-all"
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {/* Countdown or Resend Link */}
            <div className="h-6 mb-6 text-center">
              {countdown > 0 ? (
                <p className="text-gray-600 text-sm">
                  Resend code in{" "}
                  <span className="font-semibold">{formatTime(countdown)}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Not your email?/Didn't receive the code?{" "}
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
              className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 text-base mb-6 ${
                isLoading || isResending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl active:scale-[0.98]"
              }`}
            >
              <FaSignInAlt className="w-5 h-5" />
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            {/* Security Reminder */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 w-full flex items-start gap-3">
              <FiInfo className="mt-0.5 flex-shrink-0 w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Security Reminder</p>
                <p className="text-blue-700">
                  Never share your OTP codes with anyone. We'll never ask for
                  your verification codes via phone or email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
