import { useState, useEffect, useRef } from "react";
import { FaSignInAlt } from "react-icons/fa";

export default function OtpVerificationModal({ email, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [isResending, setIsResending] = useState(false);
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

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      setError("Please enter the full 4-digit OTP.");
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
        setSuccessMessage("OTP verified successfully!");
        setTimeout(() => {
          if (typeof onSuccess === "function") onSuccess(data.userId);
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
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
        setSuccessMessage("A new OTP has been sent to your email.");
        setCountdown(600);
      } else setError(data.message || "Failed to resend OTP.");
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    }
    setIsResending(false);
  };

  // ======= NEW UI ONLY =======
  return (
    <div className="relative w-full min-h-screen">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 z-0 bg-black/20"></div>

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-20 mb-10 rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white pt-6 pb-3"
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
          <h2 className="text-lg sm:text-xl font-bold">Email Authentication</h2>
          <h4 className="text-sm sm:text-base font-bold">
            Enter one-time password
          </h4>
          <p className="text-xs sm:text-sm text-center opacity-90 mt-1">
            A one-time password has been sent to
          </p>
          <p className="text-xs sm:text-sm text-center opacity-90 mt-1 font-bold italic mb-0">
            {email}
          </p>
        </div>

        <p className="text-sm sm:text-base text-center text-[#00712D] opacity-90 mt-5 px-4 sm:px-6">
          Enter the 4 digit code we sent you via email to continue.
        </p>

        {/* OTP Inputs */}
        <form
          className="flex flex-col items-center gap-4 mt-6 px-4 sm:px-6"
          onSubmit={handleVerify}
        >
          <div className="flex justify-center gap-3 sm:gap-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 sm:w-16 sm:h-16 text-center text-lg sm:text-xl border-2 border-[#8B5E3C] focus:outline-none focus:border-orange-400 rounded"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isResending}
            className="mt-3 w-full sm:w-[400px] flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow text-sm sm:text-base"
            style={{
              backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
            }}
          >
            <FaSignInAlt className="w-4 h-4 sm:w-5 sm:h-5" /> Verify
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className={`flex items-center gap-2 mt-2 text-sm ${
              countdown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-orange-500"
            }`}
          >
            Resend OTP {countdown > 0 && `(${countdown}s)`}
          </button>

          <div className="p-4 mt-2 mb-4 rounded-lg bg-blue-100 text-blue-800 w-full sm:w-[400px] flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mt-1 flex-shrink-0 w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <p className="text-sm">
              <span className="font-bold">Security Reminder</span>
              <br />
              Never share your OTP codes with anyone. We'll never ask for your
              verification codes via phone or email.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
