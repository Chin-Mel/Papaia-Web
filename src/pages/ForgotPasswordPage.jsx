// ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import this
import { FaSignInAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Header from "../components/Header/HeaderStart";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const navigate = useNavigate();

  const validateEmailFormat = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value.trim())) {
      setEmailFormatError("Please enter a valid email address.");
    } else {
      setEmailFormatError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || emailFormatError) {
      setError("Please enter a valid email.");
      return;
    }

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
        navigate("/verify-otp", { state: { email: email.trim() } });
      } else {
        setError(data.message || "Email not found or invalid.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Failed to connect to server.");
    }
  };

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/hero-background.png')" }}
      >
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        <div className="relative z-10 w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
          <div
            className="flex flex-col items-center justify-center text-white p-6"
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

            <h2 className="text-xl font-bold">Forgot Password</h2>
            <p className="text-sm text-center opacity-90 mt-1">
              You will receive an email with a one-time password
            </p>
          </div>

          <div className="bg-white p-6">
            <form onSubmit={handleSubmit}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <MdEmail className="text-[#FF8C42] text-lg" />
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmailFormat(e.target.value);
                }}
                className="w-full px-4 py-2 border-2 mt-1 border-[#E5E7EB] placeholder-[#ADAEBC] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              {emailFormatError && (
                <p className="text-red-500 text-sm mt-1">{emailFormatError}</p>
              )}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button
                type="submit"
                className="mt-6 w-full flex justify-center items-center gap-2 text-white font-medium py-2 rounded-md shadow"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #F0820B, #F97316)",
                }}
              >
                <FaSignInAlt className="w-5 h-5" /> Send OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
