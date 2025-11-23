import { useState } from "react";
import { ArrowRight, Home } from "lucide-react";
import PapayaLogo from "../../assets/ic_papaia_logo_no_word.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";

// Success Modal Component
export default function NewPasswordModal({ userId, onPasswordSaved }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain a special character";
    return "";
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    const validationError = validatePassword(value);

    if (validationError) {
      setPasswordError(validationError);
    } else if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    const validationError = validatePassword(newPassword);

    if (validationError) {
      setPasswordError(validationError);
    } else if (newPassword !== value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSavePassword = async () => {
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onPasswordSaved();
      setLoading(false);
    }, 1000);
  };

  const isPasswordValid =
    newPassword &&
    !validatePassword(newPassword) &&
    confirmPassword &&
    newPassword === confirmPassword;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] px-4 py-6">
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.2)] bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-5 px-4"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #00712D, #F97316)",
          }}
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg mb-3 ring-4 ring-white/30">
            <img src={PapayaLogo} alt="Logo" className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold">Create New Password</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-semibold text-xs">
              Security Verified
            </p>
          </div>

          <p className="text-gray-600 text-center mb-5 text-xs">
            Your account is ready to set a new password.
          </p>

          {/* New Password */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-800 flex items-center gap-1 mb-1">
              <svg
                className="w-3 h-3 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
              >
                {showNewPassword ? EyeOffIcon : EyeIcon}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-800 flex items-center gap-1 mb-1">
              <svg
                className="w-3 h-3 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-all"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
              >
                {showConfirmPassword ? EyeOffIcon : EyeIcon}
              </button>
            </div>
          </div>

          {/* Error */}
          {passwordError && (
            <p className="text-red-500 text-xs text-center mb-3">
              {passwordError}
            </p>
          )}

          {/* Requirements */}
          {newPassword && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                Password must contain:
              </p>
              <ul className="text-xs space-y-0.5">
                <li
                  className={
                    newPassword.length >= 8
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[a-z]/.test(newPassword) ? "✓" : "○"} One lowercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[0-9]/.test(newPassword) ? "✓" : "○"} One number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                      ? "text-green-600 font-semibold"
                      : "text-blue-700"
                  }
                >
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✓" : "○"} One
                  special character
                </li>
              </ul>
            </div>
          )}

          {/* Save Button */}
          <button
            disabled={!isPasswordValid || loading}
            onClick={handleSavePassword}
            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
              !isPasswordValid || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            {loading ? "Saving..." : "Save New Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// // import { useState } from "react";
// // import { FaLock } from "react-icons/fa";
// // import EyeIcon from "../../assets/eye-icon.png";
// // import EyeOffIcon from "../../assets/eye-off-icon.png";

// // export default function NewPasswordModal({ userId, onPasswordSaved }) {
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [passwordError, setPasswordError] = useState("");
// //   const [showNewPassword, setShowNewPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   const handleSavePassword = async () => {
// //     if (newPassword !== confirmPassword) {
// //       setPasswordError("Passwords do not match");
// //       return;
// //     } else {
// //       setPasswordError("");
// //     }

// //     if (!userId) {
// //       alert("Missing user ID");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const res = await fetch(
// //         "https://papaiaapi.onrender.com/api/reset-password",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ userId, newPassword }),
// //         }
// //       );

// //       if (res.ok) {
// //         if (typeof onPasswordSaved === "function") {
// //           onPasswordSaved();
// //         }
// //       } else {
// //         const data = await res.json();
// //         alert(data.message || "Failed to reset password");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("An error occurred. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="relative w-full max-w-md mx-auto my-20 rounded-2xl shadow-lg overflow-auto bg-white">
// //       {/* Top Gradient Section */}
// //       <div
// //         className="flex flex-col items-center justify-center text-white pt-6 pb-3"
// //         style={{
// //           backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
// //         }}
// //       >
// //         <div
// //           className="rounded-full p-4 shadow-lg mb-4 flex items-center justify-center"
// //           style={{
// //             backgroundImage: "linear-gradient(to right, #2E7D32, #14B8A6)",
// //           }}
// //         >
// //           <svg
// //             xmlns="http://www.w3.org/2000/svg"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //             stroke="white"
// //             strokeWidth={2}
// //             className="w-8 h-8"
// //           >
// //             <path
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               d="M5 13l4 4L19 7"
// //             />
// //           </svg>
// //         </div>
// //         <h2 className="text-xl font-bold">Congratulations</h2>
// //       </div>

// //       {/* Security Verified Text */}
// //       <div className="text-center mt-4 px-6">
// //         <p className="text-green-700 font-semibold flex justify-center items-center gap-1">
// //           Security Verified
// //         </p>
// //         <p className="text-gray-600 mt-2">
// //           Your OTP has been verified successfully. Your account is now ready to
// //           set a new password.
// //         </p>
// //       </div>

// //       {/* Password Form */}
// //       <div className="px-6 mt-6 mb-10">
// //         <h1 className="text-2xl font-bold mb-3 text-center">
// //           Create New Password
// //         </h1>

// //         {/* New Password */}
// //         <label className="text-sm font-semibold flex items-center gap-2 mb-1">
// //           <FaLock className="text-orange-500" /> New Password
// //         </label>
// //         <div className="relative mb-4">
// //           <input
// //             type={showNewPassword ? "text" : "password"}
// //             placeholder="Enter password"
// //             value={newPassword}
// //             onChange={(e) => {
// //               setNewPassword(e.target.value);
// //               if (confirmPassword && e.target.value !== confirmPassword) {
// //                 setPasswordError("Passwords do not match");
// //               } else {
// //                 setPasswordError("");
// //               }
// //             }}
// //             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
// //           />
// //           <img
// //             src={showNewPassword ? EyeOffIcon : EyeIcon}
// //             alt="toggle password visibility"
// //             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
// //             onClick={() => setShowNewPassword(!showNewPassword)}
// //           />
// //         </div>

// //         {/* Confirm Password */}
// //         <label className="text-sm font-semibold flex items-center gap-2 mb-1">
// //           <FaLock className="text-orange-500" /> Confirm New Password
// //         </label>
// //         <div className="relative mb-1">
// //           <input
// //             type={showConfirmPassword ? "text" : "password"}
// //             placeholder="Confirm new password"
// //             value={confirmPassword}
// //             onChange={(e) => {
// //               setConfirmPassword(e.target.value);
// //               if (newPassword !== e.target.value) {
// //                 setPasswordError("Passwords do not match");
// //               } else {
// //                 setPasswordError("");
// //               }
// //             }}
// //             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
// //           />
// //           <img
// //             src={showConfirmPassword ? EyeOffIcon : EyeIcon}
// //             alt="toggle password visibility"
// //             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
// //             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //           />
// //         </div>

// //         {/* Error Message */}
// //         {/* Password error message */}
// //         <div className="h-[10px] mt-3 text-red-500 text-sm text-center">
// //           {passwordError || ""}
// //         </div>

// //         <button
// //           disabled={
// //             !newPassword || !confirmPassword || passwordError || loading
// //           }
// //           onClick={handleSavePassword}
// //           className={`transition-all duration-150 active:scale-95 active:shadow-inner hover:bg-orange-600 cursor-pointer w-full flex justify-center items-center gap-2 text-white font-medium py-3 rounded-md shadow mt-4 ${
// //             !newPassword || !confirmPassword || passwordError || loading
// //               ? "opacity-50 cursor-not-allowed"
// //               : ""
// //           }`}
// //           style={{
// //             backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
// //           }}
// //         >
// //           {loading ? "Saving..." : "→ Save New Password"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { FaLock } from "react-icons/fa";
// import EyeIcon from "../../assets/eye-icon.png";
// import EyeOffIcon from "../../assets/eye-off-icon.png";

// export default function NewPasswordModal({ userId, onPasswordSaved }) {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Password validation function
//   const validatePassword = (password) => {
//     const errors = [];

//     if (password.length < 8) {
//       errors.push("at least 8 characters");
//     }
//     if (!/[A-Z]/.test(password)) {
//       errors.push("one uppercase letter");
//     }
//     if (!/[a-z]/.test(password)) {
//       errors.push("one lowercase letter");
//     }
//     if (!/[0-9]/.test(password)) {
//       errors.push("one number");
//     }
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//       errors.push("one special character");
//     }

//     if (errors.length > 0) {
//       return `Password must contain ${errors.join(", ")}`;
//     }
//     return "";
//   };

//   const handlePasswordChange = (value) => {
//     setNewPassword(value);
//     const validationError = validatePassword(value);

//     if (validationError) {
//       setPasswordError(validationError);
//     } else if (confirmPassword && value !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//     } else {
//       setPasswordError("");
//     }
//   };

//   const handleConfirmPasswordChange = (value) => {
//     setConfirmPassword(value);
//     const validationError = validatePassword(newPassword);

//     if (validationError) {
//       setPasswordError(validationError);
//     } else if (newPassword !== value) {
//       setPasswordError("Passwords do not match");
//     } else {
//       setPasswordError("");
//     }
//   };

//   const handleSavePassword = async () => {
//     const validationError = validatePassword(newPassword);
//     if (validationError) {
//       setPasswordError(validationError);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//       return;
//     }

//     if (!userId) {
//       alert("Missing user ID");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(
//         "https://papaiaapi.onrender.com/api/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId, newPassword }),
//         }
//       );

//       if (res.ok) {
//         if (typeof onPasswordSaved === "function") {
//           onPasswordSaved();
//         }
//       } else {
//         const data = await res.json();
//         alert(data.message || "Failed to reset password");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if password is valid
//   const isPasswordValid =
//     newPassword &&
//     !validatePassword(newPassword) &&
//     confirmPassword &&
//     newPassword === confirmPassword;

//   return (
//     <div className="relative w-full max-w-md mx-auto my-20 rounded-2xl shadow-lg overflow-hidden bg-white">
//       {/* Top Gradient Section */}
//       <div
//         className="flex flex-col items-center justify-center text-white pt-6 pb-3"
//         style={{
//           backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
//         }}
//       >
//         <div
//           className="rounded-full p-4 shadow-lg mb-4 flex items-center justify-center"
//           style={{
//             backgroundImage: "linear-gradient(to right, #2E7D32, #14B8A6)",
//           }}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="white"
//             strokeWidth={2}
//             className="w-8 h-8"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold">Congratulations</h2>
//       </div>

//       {/* Security Verified Text */}
//       <div className="text-center mt-4 px-6">
//         <p className="text-green-700 font-semibold">Security Verified</p>
//         <p className="text-gray-600 mt-2">
//           Your OTP has been verified successfully. Your account is now ready to
//           set a new password.
//         </p>
//       </div>

//       {/* Password Form */}
//       <div className="px-6 mt-6 mb-10">
//         <h1 className="text-2xl font-bold mb-3 text-center">
//           Create New Password
//         </h1>

//         {/* Password Requirements */}
//         <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//           <p className="text-xs font-semibold text-blue-800 mb-2">
//             Password must contain:
//           </p>
//           <ul className="text-xs text-blue-700 space-y-1">
//             <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
//               ✓ At least 8 characters
//             </li>
//             <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>
//               ✓ One uppercase letter
//             </li>
//             <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>
//               ✓ One lowercase letter
//             </li>
//             <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
//               ✓ One number
//             </li>
//             <li
//               className={
//                 /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
//                   ? "text-green-600"
//                   : ""
//               }
//             >
//               ✓ One special character (!@#$%^&*...)
//             </li>
//           </ul>
//         </div>

//         {/* New Password */}
//         <label className="text-sm font-semibold flex items-center gap-2 mb-1">
//           <FaLock className="text-orange-500" /> New Password
//         </label>
//         <div className="relative mb-4">
//           <input
//             type={showNewPassword ? "text" : "password"}
//             placeholder="Enter password"
//             value={newPassword}
//             onChange={(e) => handlePasswordChange(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
//           />
//           <img
//             src={showNewPassword ? EyeOffIcon : EyeIcon}
//             alt="toggle password visibility"
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
//             onClick={() => setShowNewPassword(!showNewPassword)}
//           />
//         </div>

//         {/* Confirm Password */}
//         <label className="text-sm font-semibold flex items-center gap-2 mb-1">
//           <FaLock className="text-orange-500" /> Confirm New Password
//         </label>
//         <div className="relative mb-1">
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Confirm new password"
//             value={confirmPassword}
//             onChange={(e) => handleConfirmPasswordChange(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500"
//           />
//           <img
//             src={showConfirmPassword ? EyeOffIcon : EyeIcon}
//             alt="toggle password visibility"
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//           />
//         </div>

//         {/* Error Message */}
//         <div className="h-[40px] mt-3 text-red-500 text-sm text-center flex items-center justify-center">
//           {passwordError || ""}
//         </div>

//         <button
//           disabled={!isPasswordValid || loading}
//           onClick={handleSavePassword}
//           className={`transition-all duration-150 active:scale-95 active:shadow-inner hover:bg-orange-600 cursor-pointer w-full flex justify-center items-center gap-2 text-white font-medium py-3 rounded-md shadow ${
//             !isPasswordValid || loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           style={{
//             backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
//           }}
//         >
//           {loading ? "Saving..." : "→ Save New Password"}
//         </button>
//       </div>
//     </div>
//   );
// }
