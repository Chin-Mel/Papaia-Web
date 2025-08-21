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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="relative z-10 w-full max-w-md h-[500px] rounded-2xl shadow-lg overflow-hidden bg-white mt-20 mb-[30px]">
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
          <h2 className="text-xl font-bold">Email Authentication</h2>
          <h4 className="text-sm font-bold">Enter one-time password</h4>
          <p className="text-sm text-center opacity-90 mt-1">
            A one-time password has been sent to
          </p>
          <p className="text-sm text-center opacity-90 mt-1 font-bold italic mb-0">
            {email}
          </p>
        </div>

        <p className="text-sm text-center text-[#00712D] opacity-90 mt-5">
          Enter the 4 digit code we sent you via email to continue.
        </p>

        {/* OTP Inputs */}
        <form
          onSubmit={handleVerify}
          className="flex flex-col items-center gap-4 mt-6"
        >
          <div className="flex justify-center gap-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-16 h-16 text-center text-lg border-2 border-[#8B5E3C] focus:outline-none focus:border-orange-400 rounded"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className="mt-6 w-[400px] flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow"
            style={{
              backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
            }}
          >
            <FaSignInAlt className="w-5 h-5" /> Verify
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
        </form>

        <p className="text-xs text-center text-black opacity-90 mt-4">
          Not your email?/Didn’t receive the code?{" "}
          <button onClick={handleResend} className="text-[#FF8C42] underline">
            Try Again
          </button>
        </p>
      </div>
    </div>
  );
}
