import { useState } from "react";
import { FaLock } from "react-icons/fa";
import EyeIcon from "../../assets/eye-icon.png";
import EyeOffIcon from "../../assets/eye-off-icon.png";

export default function NewPasswordModal({ userId }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
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
        // ✅ Directly go to login page
        window.location.href = "/signin";
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="relative z-10 w-full max-w-md rounded-2xl shadow-lg overflow-auto bg-white mt-10">
        {/* Top Gradient Section */}
        <div
          className="flex flex-col items-center justify-center text-white pt-6 pb-3"
          style={{
            backgroundImage: "linear-gradient(to right, #00712D, #F97316)",
          }}
        >
          <div
            className="rounded-full p-4 shadow-lg mb-4 flex items-center justify-center"
            style={{
              backgroundImage: "linear-gradient(to right, #2E7D32, #14B8A6)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Congratulations</h2>
        </div>

        {/* Security Verified Text */}
        <div className="text-center mt-4 px-6">
          <p className="text-green-700 font-semibold flex justify-center items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-green-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 .341-.034.676-.097.995m-4.905-.995c0 .341-.034.676-.097.995m8.002 2.202a3.973 3.973 0 001.099-1.202m-9.902 0a3.973 3.973 0 001.099 1.202M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Security Verified
          </p>
          <p className="text-gray-600 mt-2">
            Your OTP has been verified successfully. Your account is now ready
            to set a new password.
          </p>
        </div>

        {/* Password Form */}
        <div className="px-6 mt-6 mb-10">
          <h1 className="text-2xl font-bold mb-3 text-center">
            Create New Password
          </h1>

          {/* New Password */}
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <FaLock className="text-orange-500" /> New Password
          </label>
          <div className="relative mb-4">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            />
            <img
              src={showNewPassword ? EyeOffIcon : EyeIcon}
              alt="toggle password visibility"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          {/* Confirm Password */}
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <FaLock className="text-orange-500" /> Confirm New Password
          </label>
          <div className="relative mb-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (newPassword !== e.target.value) {
                  setPasswordError("Passwords do not match");
                } else {
                  setPasswordError("");
                }
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            />
            <img
              src={showConfirmPassword ? EyeOffIcon : EyeIcon}
              alt="toggle password visibility"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className="h-[10px] mt-3 text-red-500 text-sm text-center">
              {passwordError}
            </div>
          )}

          <button
            disabled={
              !newPassword || !confirmPassword || passwordError || loading
            }
            onClick={handleSavePassword}
            className={`transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full flex justify-center items-center gap-2 text-white font-medium py-3 rounded-md shadow mt-4 ${
              !newPassword || !confirmPassword || passwordError || loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            style={{
              backgroundImage: "linear-gradient(to right, #F0820B, #F97316)",
            }}
          >
            {loading ? "Saving..." : "→ Save New Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
