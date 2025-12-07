// OtpVerificationModal.jsx - Optimized Version
import { useState, useEffect, useRef } from "react";
import { FiInfo } from "react-icons/fi";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import { useAlert } from "../../AlertContext";

export default function OtpVerificationModal({ email, onSuccess }) {
  const { showAlert } = useAlert();

  // OTP state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [touched, setTouched] = useState([false, false, false, false]);

  // Timer state
  const [countdown, setCountdown] = useState(180); // 3 minutes

  // Loading states
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for input focus
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleChange = (value, index) => {
    // Only allow digits
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Mark as touched
      const newTouched = [...touched];
      newTouched[index] = false;
      setTouched(newTouched);

      // Auto-focus next input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    }
  };

  // Handle input blur
  const handleBlur = (index) => {
    const newTouched = [...touched];
    newTouched[index] = true;
    setTouched(newTouched);
  };

  // Get border class for each input
  const getBorderClass = (index) => {
    if (touched[index] && !otp[index]) {
      return "border-red-500 border-2";
    }
    return "border-[#8B4513] focus:border-orange-500 focus:border-2";
  };

  // Handle OTP verification
  const handleVerify = async () => {
    // Mark all as touched
    setTouched([true, true, true, true]);

    const enteredOtp = otp.join("");

    // Validate complete OTP
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
        setTimeout(() => {
          onSuccess(data.userId);
        }, 1500);
      } else {
        // Handle specific error cases
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

  // Handle resend OTP
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
        setCountdown(180); // Reset to 3 minutes
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

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* Header - Shorter */}
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
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-center">
            Email Authentication
          </h2>
          <p className="text-xs text-center opacity-90 mt-1">
            A one-time password has been sent to
          </p>
          <p className="text-sm font-semibold text-white">{email}</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 sm:p-8">
          <p className="text-base sm:text-lg text-center text-[#00712D] mb-6 font-medium">
            Enter the 4 digit code to continue
          </p>

          {/* OTP Inputs */}
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

          {/* Countdown / Resend */}
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

          {/* Verify Button */}
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

          {/* Security Info */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-3">
            <FiInfo className="mt-0.5 flex-shrink-0 w-5 h-5 text-blue-600" />
            <div className="text-sm">
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

// import { useState, useEffect, useRef } from "react";
// import { FaSignInAlt } from "react-icons/fa";
// import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
// import { FiInfo } from "react-icons/fi";
// import Alert from "../Alert";

// export default function OtpVerificationModal({ email, onSuccess }) {
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [error, setError] = useState("");
//   const [countdown, setCountdown] = useState(60);
//   const [isResending, setIsResending] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRefs = useRef([]);
//   const [alert, setAlert] = useState({ type: "", message: "" });

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const handleChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       if (value && index < otp.length - 1) inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleVerify = async () => {
//     setError("");
//     setIsLoading(true);
//     const enteredOtp = otp.join("");

//     if (enteredOtp.length !== 4) {
//       setError("Please enter the full 4-digit OTP.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://papaiaapi.onrender.com/api/verify-otp",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, otp: enteredOtp }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setAlert({
//           type: "success",
//           message: "OTP verified successfully!",
//         });
//         setTimeout(() => {
//           onSuccess(data.userId);
//         }, 1500);
//       } else {
//         setError(data.message || "Invalid or expired OTP. Please try again.");
//       }
//     } catch (err) {
//       setError("Failed to connect to server. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     if (countdown > 0 || isResending) return;
//     setIsResending(true);
//     setError("");

//     try {
//       const response = await fetch(
//         "https://papaiaapi.onrender.com/api/forgot-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setAlert({
//           type: "success",
//           message: "A new OTP has been sent to your email.",
//         });
//         setCountdown(60);
//         setOtp(["", "", "", ""]);
//       } else {
//         setError(data.message || "Failed to resend OTP. Please try again.");
//       }
//     } catch (err) {
//       setError("Failed to connect to server. Please try again.");
//     } finally {
//       setIsResending(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <>
//       <Alert
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert({ type: "", message: "" })}
//       />
//       <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
//         <div
//           className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
//           style={{ minHeight: "450px" }}
//         >
//           {/* Header with gradient background */}
//           <div
//             className="flex flex-col items-center justify-center text-white p-4"
//             style={{
//               backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
//             }}
//           >
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
//               <img
//                 src={PapayaLogo}
//                 alt="Papaia Logo"
//                 className="w-7 h-9"
//                 loading="eager"
//                 decoding="async"
//               />
//             </div>
//             <h2 className="text-base sm:text-lg md:text-xl font-bold text-center">
//               Email Authentication
//             </h2>
//             <p className="text-[9px] sm:text-xs md:text-sm text-center opacity-90 mt-1">
//               A one-time password has been sent to
//             </p>
//             <p className="text-xs sm:text-sm md:text-base font-semibold text-white">
//               {email}
//             </p>
//           </div>

//           {/* Content - Scrollable */}
//           <div className="bg-white p-6 overflow-y-auto">
//             <p className="text-base sm:text-lg text-center text-[#00712D] mb-6 font-medium">
//               Enter the 4 digit code to continue
//             </p>

//             {/* OTP Inputs */}
//             <div className="flex justify-center gap-3 sm:gap-4 mb-6">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleChange(e.target.value, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-semibold border-2 border-[#8B4513] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg transition-all"
//                 />
//               ))}
//             </div>

//             {/* Error */}
//             {error && (
//               <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
//             )}

//             {/* Countdown/Resend */}
//             <div className="mb-6 text-center">
//               {countdown > 0 ? (
//                 <p className="text-gray-600 text-sm">
//                   Resend code in{" "}
//                   <span className="font-semibold">{formatTime(countdown)}</span>
//                 </p>
//               ) : (
//                 <p className="text-sm text-gray-600">
//                   Didn't receive the code?{" "}
//                   <button
//                     onClick={handleResend}
//                     disabled={isResending}
//                     className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
//                   >
//                     Try Again
//                   </button>
//                 </p>
//               )}
//             </div>

//             {/* Verify Button */}
//             <button
//               onClick={handleVerify}
//               disabled={isLoading || isResending}
//               className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 text-sm mb-6 ${
//                 isLoading || isResending
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:shadow-xl active:scale-[0.98]"
//               }`}
//             >
//               <FaSignInAlt className="w-5 h-5" />
//               {isLoading ? "Verifying..." : "Verify"}
//             </button>

//             {/* Security Reminder */}
//             <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-3">
//               <FiInfo className="mt-0.5 flex-shrink-0 w-5 h-5 text-blue-600" />
//               <div className="text-sm">
//                 <p className="font-bold mb-1">Security Reminder</p>
//                 <p className="text-blue-700">
//                   Never share your OTP codes with anyone.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
