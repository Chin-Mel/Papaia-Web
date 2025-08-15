import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignInAlt, FaInfoCircle } from "react-icons/fa";

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resending, setResending] = useState(false);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }
    if (!email) {
      setError("Invalid or expired OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/new-password", { state: { userId: data.userId } });
      } else {
        setError(data.message || "Invalid or expired OTP.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendDisabled || !email) return;

    try {
      setError("");
      setMessage("");
      setResending(true);
      setResendDisabled(true);
      setResendCountdown(30);

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("A new OTP has been sent to your email.");
      } else {
        setError(data.message || "Unable to resend OTP.");
      }
    } catch {
      setError("Something went wrong while resending OTP.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/papaiaa.jpg')" }}
    >
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md h-[625px] rounded-2xl shadow-lg overflow-hidden bg-white">
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
            {email || "your email"}
          </p>
        </div>

        <p className="text-sm text-center text-[#00712D] opacity-90 mt-5">
          Enter the 4 digit code we sent you via email to continue.
        </p>

        <div className="flex justify-center gap-5 mt-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-16 h-16 text-center text-lg border-2 border-[#8B5E3C] focus:outline-none focus:border-orange-400"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm text-center mt-3">{message}</p>
        )}

        <p className="text-xs text-center text-black opacity-90 mt-4">
          Not your email?/Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className="text-[#FF8C42] text-xs underline disabled:opacity-50"
          >
            {resendDisabled
              ? `Resend in ${resendCountdown}s`
              : resending
              ? "Resending..."
              : "Resend"}
          </button>
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-6 w-[400px] mx-auto flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow disabled:opacity-50"
          style={{
            backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
          }}
        >
          <FaSignInAlt className="w-5 h-5" />
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="relative z-10 w-[400px] h-[110px] mx-auto flex pl-7 pt-5 rounded-2xl shadow-lg overflow-hidden bg-[#EFF6FF] mt-4">
          <div className="flex gap-2">
            <FaInfoCircle className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="text-sm text-[#1E40AF]">Security Reminder</h3>
              <p className="text-xs text-[#2563EB] mt-1">
                Never share your OTP codes with anyone. We'll never ask for your
                verification codes via phone or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
