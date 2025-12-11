import { useState, useEffect, useRef } from "react";
import { FiInfo } from "react-icons/fi";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { useAlert } from "../../AlertContext";

export default function OtpVerificationModal({ email, onSuccess }) {
  const { showAlert } = useAlert();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [touched, setTouched] = useState([false, false, false, false]);

  const [countdown, setCountdown] = useState(180);

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

      const newTouched = [...touched];
      newTouched[index] = false;
      setTouched(newTouched);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    }
  };

  const handleBlur = (index) => {
    const newTouched = [...touched];
    newTouched[index] = true;
    setTouched(newTouched);
  };

  const getBorderClass = (index) => {
    if (touched[index] && !otp[index]) {
      return "border-red-500 border-2";
    }
    return "border-[#8B4513] focus:border-orange-500 focus:border-2";
  };

  const handleVerify = async () => {
    setTouched([true, true, true, true]);

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

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
        showAlert("success", "OTP Verification Successful!");
        onSuccess(data.userId);
      } else {
        if (data?.message?.toLowerCase().includes("expired")) {
          showAlert("error", "Expired OTP.");
        } else if (
          data?.message?.toLowerCase().includes("invalid") ||
          data?.message?.toLowerCase().includes("incorrect")
        ) {
          showAlert("error", "Invalid OTP.");
        } else if (
          data?.message?.toLowerCase().includes("farmer") ||
          data?.role === "farmer"
        ) {
          showAlert("error", "Email is a farmer email.");
        } else {
          showAlert(
            "error",
            data.message || "Verification failed. Please try again."
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

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);

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
        showAlert("success", "A new OTP has been sent to your email.");
        setCountdown(180);
        setOtp(["", "", "", ""]);
        setTouched([false, false, false, false]);
        inputRefs.current[0].focus();
      } else {
        showAlert(
          "error",
          data.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (err) {
      showAlert(
        "error",
        "Failed to connect to server. Please check your connection and try again."
      );
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
    <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
      <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        <div
          className="flex flex-col items-center justify-center text-white p-4"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl mb-2 ring-4 ring-white/30">
            <img
              src={PapayaLogo}
              alt="Papaia Logo"
              className="w-6 h-8 object-contain"
              loading="eager"
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-center">
            OTP Verification
          </h2>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <p className="text-base sm:text-lg text-center text-[#00712D] mb-6 font-medium">
            Enter the 4 digit code sent to your email to continue
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => handleBlur(index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${getBorderClass(
                  index
                )}`}
              />
            ))}
          </div>

          <div className="mb-6 text-center">
            {countdown > 0 ? (
              <p className="text-gray-600 text-sm">
                Resend code in{" "}
                <span className="font-semibold text-[#00712D]">
                  {formatTime(countdown)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-orange-500 font-semibold hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || isResending}
            className="w-full flex justify-center items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
