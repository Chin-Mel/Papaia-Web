import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer/FooterMain";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔑 ensures JWT cookie is stored
        body: JSON.stringify({
          identifier: usernameOrEmail,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials. Please try again.");
        } else if (response.status === 403) {
          throw new Error("Please verify your email before logging in.");
        } else {
          throw new Error("Login failed. Please try again later.");
        }
      }

      // ✅ Success
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
          }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-full py-30 px-6">
          <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 items-center bg-white/21 backdrop-blur-[5.4px] rounded-[20px] border border-white/1 overflow-hidden">
            {/* Column 1: Image */}
            <div className="hidden lg:block h-full">
              <img
                src={SignInImage}
                alt="Farmer in a papaya field"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Column 2: Form */}
            <div className="relative flex justify-center items-center py-8 px-4 sm:px-8">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <img
                      src={PapayaLogo}
                      alt="Papaia Logo"
                      className="w-14 h-14"
                    />
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center w-full">
                    <h1 className="text-2xl font-bold text-white font-['Poppins']">
                      Papaya Farm
                    </h1>
                    <p className="text-[#FDEDD3] text-sm mt-1">
                      Welcome back to your farm dashboard
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <img
                          src={UserIcon}
                          alt="Username"
                          className="w-4 h-4"
                        />
                        Username or Email
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username or email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-base placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <img
                          src={LockIcon}
                          alt="Password"
                          className="w-4 h-4"
                        />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-base placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <img
                              src={EyeOffIcon}
                              alt="Hide Password"
                              className="w-5 h-5"
                            />
                          ) : (
                            <img
                              src={EyeIcon}
                              alt="Show Password"
                              className="w-5 h-4"
                            />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 border border-gray-400 rounded-sm accent-orange-500"
                        />
                        <span className="text-sm text-gray-500">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm text-center">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-[#F0820B] to-[#F97316] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <img src={LoginIcon} alt="Login" className="w-5 h-5" />
                      {loading ? "Logging in..." : "Login to Farm"}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <span className="text-gray-500">
                      Don't have an account?{" "}
                    </span>
                    <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                      Sign up here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
