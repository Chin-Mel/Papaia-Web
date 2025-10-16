import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";

import BackgroundImage from "../assets/hero-background.png";
import PapayaLogo from "../assets/papaia-logo.png";
import UserIcon from "../assets/user-icon.png";
import LockIcon from "../assets/lock-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";
import LoginIcon from "../assets/login-icon.png";
import SignInImage from "../assets/sign-in-pic.png";

export default function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const safeEmail = usernameOrEmail.trim();
      const safePassword = password.trim();

      // ✅ Validate before sending
      if (!safeEmail || !safePassword) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      if (safeEmail.includes("@") && !validateEmail(safeEmail)) {
        setError("Invalid email format.");
        setLoading(false);
        return;
      }

      // 🔑 Login request
      const loginResponse = await fetch(
        "https://papaiaapi.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: safeEmail, password: safePassword }),
        }
      );

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Login failed. Please check your credentials."
        );
      }

      const loginData = await loginResponse.json();
      console.log("Login successful:", loginData);

      // ✅ Check only the one field your API actually returns
      if (loginData.user?.emailVerified === false) {
        setError(
          "Your account is not verified. Please check your email and verify your account before logging in."
        );
        setLoading(false);
        return;
      }

      console.log("Verification check passed");

      // ✅ Check if user has farmer role (block farmers from accessing owner dashboard)
      if (
        loginData.user &&
        loginData.user.role &&
        loginData.user.role.toLowerCase() === "farmer"
      ) {
        setError(
          "Access denied. This dashboard is only available for farm owners. Please use the farmer mobile app."
        );
        setLoading(false);
        return;
      }

      // ✅ Additional role check - only allow owners or admins
      const allowedRoles = ["owner"];
      if (
        loginData.user &&
        loginData.user.role &&
        !allowedRoles.includes(loginData.user.role.toLowerCase())
      ) {
        setError(
          "Access denied. This dashboard is only available for farm owners."
        );
        setLoading(false);
        return;
      }

      // ✅ Store JWT token
      if (loginData.token) {
        localStorage.setItem("token", loginData.token); // always store in localStorage
      }

      // ✅ Store user info
      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      // ✅ Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1 relative flex justify-center items-center pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-auto">
        {/* Background with blur */}
        <div className="absolute inset-0">
          <img
            src={BackgroundImage}
            alt="Background"
            className="w-full h-full object-cover blur-[2px] opacity-95"
          />
        </div>

        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
            <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
              {/* Logo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                <img
                  src={PapayaLogo}
                  alt="Papaia Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>

              {/* Text */}
              <h1 className="text-lg sm:text-xl font-bold text-white font-['Poppins'] mt-[2px]">
                Papaya Farm
              </h1>
              <p className="text-[#FDEDD3] text-xs sm:text-sm mt-1 text-center">
                Welcome back to your farm dashboard
              </p>
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
              <form
                className="space-y-4 sm:space-y-5 flex flex-col justify-start"
                onSubmit={handleSubmit}
              >
                {/* Username */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                    <img src={UserIcon} alt="Username" className="w-4 h-4" />
                    Username or Email
                  </label>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Enter your username or email"
                    value={usernameOrEmail}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUsernameOrEmail(value);

                      if (value.includes("@") && !validateEmail(value)) {
                        setError("Invalid email format.");
                      } else {
                        setError("");
                      }
                    }}
                    className="w-full h-10 sm:h-11 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                    <img src={LockIcon} alt="Password" className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 sm:h-11 px-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <img src={EyeOffIcon} alt="Hide" className="w-5 h-5" />
                      ) : (
                        <img src={EyeIcon} alt="Show" className="w-5 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border border-gray-400 rounded-sm accent-orange-500"
                    />
                    <span className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:underline ">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 bg-gradient-to-r bg-[#F0820B] hover:bg-orange-600 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <img
                    src={LoginIcon}
                    alt="Login"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  {loading ? "Logging in..." : "Login to Farm"}
                </button>

                {/* Error space */}
                <div className="h-[14px] mt-1 flex items-center justify-center">
                  {error && (
                    <p className="text-red-500 text-xs text-center leading-none">
                      {error}
                    </p>
                  )}
                </div>
              </form>

              {/* Sign up link */}
              <div className="mt-4 text-center">
                <span className="text-gray-500 text-xs sm:text-sm">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/sign-up"
                  className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors cursor-pointer inline-block"
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterStart />
    </div>
  );
}
