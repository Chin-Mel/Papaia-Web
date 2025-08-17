import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { secureApiCall, validateEmail, sanitizeInput } from "../utils/security";
import SecureInput from "../components/SecureInput";
import HeaderStart from "../components/Header/HeaderStart";
import FooterMain from "../components/Footer/FooterMain";
import loginBackgroundPic from "../assets/login-backgroundpic.jpg";
import userIcon from "../assets/user-icon.png";
import lockIcon from "../assets/lock-icon.png";
import eyeIcon from "../assets/eye-icon.png";
import arrowIcon from "../assets/arrow-icon.png";
import papaiaLogo from "../assets/papaia-logo.png";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from location state
  const from = location.state?.from || "/dashboard";

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await secureApiCall("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          username: sanitizeInput(formData.username),
          password: formData.password, // Don't sanitize password
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } else {
        const errorData = await response.json();
        setErrors({
          general:
            errorData.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrors({
        general: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderStart />

      {/* Main Content with Background */}
      <main className="flex-1 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${loginBackgroundPic})`,
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-md w-full">
            {/* Sign-in Form Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header with Gradient */}
              <div className="bg-gradient-to-r from-[#4A7C59] to-[#FF8C42] p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <img src={papaiaLogo} alt="Papaia Logo" className="w-8 h-8" />
                </div>
                <h1 className="text-white text-xl font-bold mb-1">
                  Papaya Farm
                </h1>
                <p className="text-white text-sm opacity-90">
                  Welcome back to your farm dashboard
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{errors.general}</p>
                    </div>
                  )}

                  {/* Username Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <img src={userIcon} alt="User" className="w-4 h-4" />
                      Username
                    </label>
                    <SecureInput
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      placeholder="Enter your username"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent ${
                        errors.username ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <img src={lockIcon} alt="Lock" className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <SecureInput
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder="Enter your password"
                        className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C59] focus:border-transparent ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <img
                          src={eyeIcon}
                          alt="Toggle password"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me and Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          handleInputChange("rememberMe", e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#4A7C59] focus:ring-[#4A7C59]"
                      />
                      <span className="text-sm text-gray-700">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#FF8C42] hover:text-[#E67E22] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#4A7C59] to-[#FF8C42] text-white font-bold py-3 px-4 rounded-lg hover:from-[#2D5016] hover:to-[#E67E22] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <img src={arrowIcon} alt="Arrow" className="w-4 h-4" />
                    {isLoading ? "Logging in..." : "Login to Farm"}
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/sign-up"
                      className="text-[#FF8C42] hover:text-[#E67E22] font-medium transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterMain />
    </div>
  );
}
