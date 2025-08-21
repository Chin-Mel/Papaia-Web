import { useState, useEffect } from "react";
import { FaCheckCircle, FaRedo } from "react-icons/fa";

export default function OtpVerificationModal({ email, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 inputs
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(600); // 10 minutes = 600 seconds
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
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
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
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
        setSuccessMessage("OTP verified successfully!");
        setTimeout(() => {
          if (typeof onSuccess === "function") onSuccess(data.userId);
        }, 1000);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Failed to connect to server.");
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
        setSuccessMessage("A new OTP has been sent to your email.");
        setCountdown(600); // reset 10-minute countdown
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Failed to connect to server.");
    }

    setIsResending(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="bg-orange-100 rounded-full p-4 shadow mb-2">
            <FaCheckCircle className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold">Verify OTP</h2>
          <p className="text-sm text-gray-600 text-center">
            Enter the 4-digit OTP sent to <b>{email}</b>
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleVerify}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                maxLength={1}
                className="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full text-white font-medium py-2 rounded-md shadow bg-gradient-to-r from-orange-500 to-orange-400"
          >
            Verify OTP
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
            <FaRedo /> Resend OTP {countdown > 0 && `(${countdown}s)`}
          </button>
        </form>
      </div>
    </div>
  );
}
