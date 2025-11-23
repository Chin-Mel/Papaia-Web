import { useState } from "react";
import { ArrowRight, Home } from "lucide-react";
import PapayaLogoImage from "../../assets/ic_papaia_logo_no_word.png";

// Mock logo
const PapayaLogoImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='80' font-size='80' fill='%23F97316'%3EP%3C/text%3E%3C/svg%3E";

// Mock eye icons - replace with your actual icons
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
      clipRule="evenodd"
    />
    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
  </svg>
);

// Success Modal Component
function PasswordUpdatedSuccessModal({ isOpen, onContinue, onBackHome }) {
  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-6 px-6"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img src={PapayaLogoImage} alt="Papaia Logo" className="w-7 h-9" />
          </div>
          <h2 className="text-xl font-bold text-center">
            Password Updated Successfully
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 text-center mb-6 text-sm">
            Your password has been changed. You can now log in with your new
            credentials.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Continue to Sign in
            </button>

            <button
              onClick={onBackHome}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main New Password Modal
export default function NewPasswordModal({ userId, onPasswordSaved }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password validation
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

    if (!userId) {
      alert("Missing user ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://papaiaapi.onrender.com/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword }),
        }
      );

      if (res.ok) {
        setShowSuccess(true);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid =
    newPassword &&
    !validatePassword(newPassword) &&
    confirmPassword &&
    newPassword === confirmPassword;

  if (showSuccess) {
    return (
      <PasswordUpdatedSuccessModal
        isOpen={showSuccess}
        onContinue={() => {
          if (typeof onPasswordSaved === "function") {
            onPasswordSaved();
          }
          // Navigate to sign-in
          window.location.href = "/sign-in";
        }}
        onBackHome={() => {
          window.location.href = "/";
        }}
      />
    );
  }

  // Main password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center text-white py-6 px-6"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
            <img src={PapayaLogoImage} alt="Papaia Logo" className="w-7 h-9" />
          </div>
          <h2 className="text-xl font-bold">Create New Password</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Security Verified Badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
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

          <p className="text-gray-600 text-center mb-6 text-sm">
            Your OTP has been verified successfully. Your account is now ready
            to set a new password.
          </p>

          {/* New Password */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-orange-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-orange-500"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {passwordError && (
            <p className="text-red-500 text-sm text-center mb-4">
              {passwordError}
            </p>
          )}

          {/* Password Requirements - Only show when typing */}
          {newPassword && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-semibold text-blue-800 mb-2">
                Password must contain:
              </p>
              <ul className="text-xs space-y-1">
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
                  special character (!@#$%^&*...)
                </li>
              </ul>
            </div>
          )}

          {/* Save Button */}
          <button
            disabled={!isPasswordValid || loading}
            onClick={handleSavePassword}
            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-base ${
              !isPasswordValid || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            <ArrowRight className="w-5 h-5" />
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
