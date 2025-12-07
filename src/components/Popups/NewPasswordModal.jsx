// NewPasswordModal.jsx - Optimized Version
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import EyeIcon from "../../assets/eye-icon.png";
import EyeOffIcon from "../../assets/eye-off-icon.png";
import { useAlert } from "../../AlertContext";

export default function NewPasswordModal({ user_Id, onPasswordSaved }) {
  const { showAlert } = useAlert();

  // Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Touched state
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // Get border class based on validation
  const getBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "newPassword") {
      setNewPassword(value);
    } else if (fieldName === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear touched state when user starts typing
    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handle save password
  const handleSavePassword = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all as touched
    setTouched({
      newPassword: true,
      confirmPassword: true,
    });

    // Validate required fields
    if (!newPassword || !confirmPassword) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      showAlert("error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user_Id,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onPasswordSaved();
      } else {
        showAlert(
          "error",
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      showAlert(
        "error",
        "Failed to connect to server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSavePassword();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
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
            Create New Password
          </h2>
          <p className="text-sm text-center opacity-90 mt-1">
            Set a secure password for your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePassword} className="p-6 sm:p-8 space-y-5">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-semibold text-sm">
              Security Verified
            </p>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium block">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) =>
                  handleFieldChange("newPassword", e.target.value)
                }
                onBlur={() => handleBlur("newPassword")}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all ${getBorderClass(
                  "newPassword",
                  newPassword
                )}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <img
                  src={showNewPassword ? EyeOffIcon : EyeIcon}
                  alt=""
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium block">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  handleFieldChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                onKeyDown={handleKeyDown}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all ${getBorderClass(
                  "confirmPassword",
                  confirmPassword
                )}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <img
                  src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                  alt=""
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { ArrowRight, Eye, EyeOff } from "lucide-react";
// import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
// import Alert from "../Alert";

// export default function NewPasswordModal({ user_Id, onPasswordSaved }) {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const [fieldErrors, setFieldErrors] = useState({
//     newPassword: false,
//     confirmPassword: false,
//   });
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validatePassword = (password) => {
//     if (password.length < 8) return "Password must be at least 8 characters";
//     if (!/[A-Z]/.test(password))
//       return "Password must contain an uppercase letter";
//     if (!/[a-z]/.test(password))
//       return "Password must contain a lowercase letter";
//     if (!/[0-9]/.test(password)) return "Password must contain a number";
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
//       return "Password must contain a special character";
//     return "";
//   };

//   const handlePasswordChange = (value) => {
//     setNewPassword(value);
//     setFieldErrors((prev) => ({ ...prev, newPassword: false }));
//     const validationError = validatePassword(value);

//     if (validationError) {
//       setAlert({ type: "error", message: validationError });
//       setFieldErrors((prev) => ({ ...prev, newPassword: true }));
//     } else if (confirmPassword && value !== confirmPassword) {
//       setAlert({ type: "error", message: "Passwords do not match" });
//       setFieldErrors({ newPassword: true, confirmPassword: true });
//     } else {
//       setAlert({ type: "", message: "" });
//       setFieldErrors({ newPassword: false, confirmPassword: false });
//     }
//   };

//   const handleConfirmPasswordChange = (value) => {
//     setConfirmPassword(value);
//     setFieldErrors((prev) => ({ ...prev, confirmPassword: false }));
//     const validationError = validatePassword(newPassword);

//     if (validationError) {
//       setAlert({ type: "error", message: validationError });
//       setFieldErrors((prev) => ({ ...prev, confirmPassword: true }));
//     } else if (newPassword !== value) {
//       setAlert({ type: "error", message: "Passwords do not match" });
//       setFieldErrors({ newPassword: true, confirmPassword: true });
//     } else {
//       setAlert({ type: "", message: "" });
//       setFieldErrors({ newPassword: false, confirmPassword: false });
//     }
//   };

//   const handleSavePassword = async () => {
//     const validationError = validatePassword(newPassword);
//     if (validationError) {
//       setAlert({ type: "error", message: validationError });
//       setFieldErrors({ newPassword: true, confirmPassword: false });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setAlert({ type: "error", message: "Passwords do not match" });
//       setFieldErrors({ newPassword: true, confirmPassword: true });
//       return;
//     }

//     setLoading(true);
//     setAlert({ type: "", message: "" });

//     try {
//       const response = await fetch(
//         "https://papaiaapi.onrender.com/api/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             userId: user_Id,
//             newPassword: newPassword,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setAlert({
//           type: "success",
//           message: "Password updated successfully!",
//         });
//         setTimeout(() => onPasswordSaved(), 1000);
//       } else {
//         setAlert({
//           type: "error",
//           message: data.message || "Failed to reset password.",
//         });
//       }
//     } catch (error) {
//       setAlert({ type: "error", message: "Failed to connect to server." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isPasswordValid =
//     newPassword &&
//     !validatePassword(newPassword) &&
//     confirmPassword &&
//     newPassword === confirmPassword;

//   return (
//     <>
//       <Alert
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert({ type: "", message: "" })}
//       />
//       <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
//         <div className="mx-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
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
//                 alt="Logo"
//                 className="w-7 h-9 sm:w-7 sm:h-9"
//               />
//             </div>
//             <h2 className="text-base sm:text-lg md:text-xl font-bold text-center">
//               Create New Password
//             </h2>
//             <p className="text-[9px] sm:text-xs md:text-sm text-center opacity-90 mt-1">
//               Set a secure password for your account
//             </p>
//           </div>

//           <div className="overflow-y-auto flex-1">
//             <div className="px-6 py-6 space-y-4">
//               {/* Security Badge */}
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <svg
//                   className="w-5 h-5 text-green-600"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <p className="text-green-700 font-semibold text-sm">
//                   Security Verified
//                 </p>
//               </div>

//               {/* New Password */}
//               <div>
//                 <label className="text-gray-700 text-sm font-medium">
//                   New Password *
//                 </label>
//                 <div className="relative mt-1">
//                   <input
//                     type={showNewPassword ? "text" : "password"}
//                     placeholder="Enter password"
//                     value={newPassword}
//                     onChange={(e) => handlePasswordChange(e.target.value)}
//                     className={`w-full px-4 py-3 border-2 ${
//                       fieldErrors.newPassword
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showNewPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label className="text-gray-700 text-sm font-medium">
//                   Confirm New Password *
//                 </label>
//                 <div className="relative mt-1">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm new password"
//                     value={confirmPassword}
//                     onChange={(e) =>
//                       handleConfirmPasswordChange(e.target.value)
//                     }
//                     className={`w-full px-4 py-3 border-2 ${
//                       fieldErrors.confirmPassword
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Requirements */}
//               {newPassword && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <p className="text-xs font-semibold text-blue-800 mb-2">
//                     Password must contain:
//                   </p>
//                   <ul className="space-y-1">
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         newPassword.length >= 8
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>{newPassword.length >= 8 ? "✓" : "○"}</span>
//                       <span>At least 8 characters</span>
//                     </li>
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         /[A-Z]/.test(newPassword)
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
//                       <span>One uppercase letter</span>
//                     </li>
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         /[a-z]/.test(newPassword)
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>{/[a-z]/.test(newPassword) ? "✓" : "○"}</span>
//                       <span>One lowercase letter</span>
//                     </li>
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         /[0-9]/.test(newPassword)
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
//                       <span>One number</span>
//                     </li>
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>
//                         {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"}
//                       </span>
//                       <span>One special character</span>
//                     </li>
//                     <li
//                       className={`flex items-center gap-2 text-xs ${
//                         newPassword === confirmPassword && confirmPassword
//                           ? "text-green-600 font-semibold"
//                           : "text-blue-700"
//                       }`}
//                     >
//                       <span>
//                         {newPassword === confirmPassword && confirmPassword
//                           ? "✓"
//                           : "○"}
//                       </span>
//                       <span>Passwords match</span>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="px-6 pb-6">
//             <button
//               disabled={!isPasswordValid || loading}
//               onClick={handleSavePassword}
//               className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 isPasswordValid && !loading
//                   ? "bg-[#F97316] hover:bg-orange-600 text-white"
//                   : "bg-gray-200 text-gray-400 cursor-not-allowed"
//               }`}
//             >
//               <ArrowRight className="w-5 h-5" />
//               {loading ? "Saving..." : "Save New Password"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // import { useState } from "react";
// // import { ArrowRight, Eye, EyeOff } from "lucide-react";
// // import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";

// // // Success Modal Component
// // export default function NewPasswordModal({ user_Id, onPasswordSaved }) {
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [passwordError, setPasswordError] = useState("");
// //   const [showNewPassword, setShowNewPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   const validatePassword = (password) => {
// //     if (password.length < 8) return "Password must be at least 8 characters";
// //     if (!/[A-Z]/.test(password))
// //       return "Password must contain an uppercase letter";
// //     if (!/[a-z]/.test(password))
// //       return "Password must contain a lowercase letter";
// //     if (!/[0-9]/.test(password)) return "Password must contain a number";
// //     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
// //       return "Password must contain a special character";
// //     return "";
// //   };

// //   const handlePasswordChange = (value) => {
// //     setNewPassword(value);
// //     const validationError = validatePassword(value);

// //     if (validationError) {
// //       setPasswordError(validationError);
// //     } else if (confirmPassword && value !== confirmPassword) {
// //       setPasswordError("Passwords do not match");
// //     } else {
// //       setPasswordError("");
// //     }
// //   };

// //   const handleConfirmPasswordChange = (value) => {
// //     setConfirmPassword(value);
// //     const validationError = validatePassword(newPassword);

// //     if (validationError) {
// //       setPasswordError(validationError);
// //     } else if (newPassword !== value) {
// //       setPasswordError("Passwords do not match");
// //     } else {
// //       setPasswordError("");
// //     }
// //   };

// //   const handleSavePassword = async () => {
// //     const validationError = validatePassword(newPassword);
// //     if (validationError) {
// //       setPasswordError(validationError);
// //       return;
// //     }

// //     if (newPassword !== confirmPassword) {
// //       setPasswordError("Passwords do not match");
// //       return;
// //     }

// //     setLoading(true);
// //     setPasswordError("");

// //     try {
// //       const response = await fetch(
// //         "https://papaiaapi.onrender.com/api/reset-password",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             userId: user_Id,
// //             newPassword: newPassword,
// //           }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (response.ok) {
// //         // Password reset successfully
// //         onPasswordSaved();
// //       } else {
// //         setPasswordError(
// //           data.message || "Failed to reset password. Please try again."
// //         );
// //       }
// //     } catch (error) {
// //       setPasswordError("Failed to connect to server. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const isPasswordValid =
// //     newPassword &&
// //     !validatePassword(newPassword) &&
// //     confirmPassword &&
// //     newPassword === confirmPassword;

// //   return (
// //     <div className="flex justify-center items-center min-h-screen px-4 py-12 pt-16 sm:pt-20">
// //       <div className="mx-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
// //         {/* Header with gradient background */}
// //         <div
// //           className="flex flex-col items-center justify-center text-white p-4"
// //           style={{
// //             backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
// //           }}
// //         >
// //           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
// //             <img
// //               src={PapayaLogo}
// //               alt="Logo"
// //               className="w-7 h-9 sm:w-7 sm:h-9"
// //             />
// //           </div>
// //           <h2 className="text-base sm:text-lg md:text-xl font-bold text-center">
// //             Create New Password
// //           </h2>
// //           <p className="text-[9px] sm:text-xs md:text-sm text-center opacity-90 mt-1">
// //             Set a secure password for your account
// //           </p>
// //         </div>

// //         <div className="overflow-y-auto flex-1">
// //           <div className="px-6 py-6 space-y-4">
// //             {/* Security Badge */}
// //             <div className="flex items-center justify-center gap-2 mb-2">
// //               <svg
// //                 className="w-5 h-5 text-green-600"
// //                 fill="currentColor"
// //                 viewBox="0 0 20 20"
// //               >
// //                 <path
// //                   fillRule="evenodd"
// //                   d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
// //                   clipRule="evenodd"
// //                 />
// //               </svg>
// //               <p className="text-green-700 font-semibold text-sm">
// //                 Security Verified
// //               </p>
// //             </div>

// //             {passwordError && (
// //               <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
// //                 {passwordError}
// //               </div>
// //             )}

// //             {/* New Password */}
// //             <div>
// //               <label className="text-gray-700 text-sm font-medium">
// //                 New Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showNewPassword ? "text" : "password"}
// //                   placeholder="Enter password"
// //                   value={newPassword}
// //                   onChange={(e) => handlePasswordChange(e.target.value)}
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowNewPassword(!showNewPassword)}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                 >
// //                   {showNewPassword ? (
// //                     <EyeOff className="w-5 h-5" />
// //                   ) : (
// //                     <Eye className="w-5 h-5" />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Confirm Password */}
// //             <div>
// //               <label className="text-gray-700 text-sm font-medium">
// //                 Confirm New Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   type={showConfirmPassword ? "text" : "password"}
// //                   placeholder="Confirm new password"
// //                   value={confirmPassword}
// //                   onChange={(e) => handleConfirmPasswordChange(e.target.value)}
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 text-sm"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                 >
// //                   {showConfirmPassword ? (
// //                     <EyeOff className="w-5 h-5" />
// //                   ) : (
// //                     <Eye className="w-5 h-5" />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Requirements */}
// //             {newPassword && (
// //               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
// //                 <p className="text-xs font-semibold text-blue-800 mb-2">
// //                   Password must contain:
// //                 </p>
// //                 <ul className="space-y-1">
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       newPassword.length >= 8
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>{newPassword.length >= 8 ? "✓" : "○"}</span>
// //                     <span>At least 8 characters</span>
// //                   </li>
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       /[A-Z]/.test(newPassword)
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>{/[A-Z]/.test(newPassword) ? "✓" : "○"}</span>
// //                     <span>One uppercase letter</span>
// //                   </li>
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       /[a-z]/.test(newPassword)
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>{/[a-z]/.test(newPassword) ? "✓" : "○"}</span>
// //                     <span>One lowercase letter</span>
// //                   </li>
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       /[0-9]/.test(newPassword)
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>{/[0-9]/.test(newPassword) ? "✓" : "○"}</span>
// //                     <span>One number</span>
// //                   </li>
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>
// //                       {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"}
// //                     </span>
// //                     <span>One special character</span>
// //                   </li>
// //                   <li
// //                     className={`flex items-center gap-2 text-xs ${
// //                       newPassword === confirmPassword && confirmPassword
// //                         ? "text-green-600 font-semibold"
// //                         : "text-blue-700"
// //                     }`}
// //                   >
// //                     <span>
// //                       {newPassword === confirmPassword && confirmPassword
// //                         ? "✓"
// //                         : "○"}
// //                     </span>
// //                     <span>Passwords match</span>
// //                   </li>
// //                 </ul>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="px-6 pb-6">
// //           <button
// //             disabled={!isPasswordValid || loading}
// //             onClick={handleSavePassword}
// //             className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
// //               isPasswordValid && !loading
// //                 ? "bg-[#F97316] hover:bg-orange-600 text-white"
// //                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
// //             }`}
// //           >
// //             <ArrowRight className="w-5 h-5" />
// //             {loading ? "Saving..." : "Save New Password"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
