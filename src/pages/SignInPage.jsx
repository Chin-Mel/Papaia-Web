// SignInPage.jsx - Complete Optimized Version
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import MainBackground from "../assets/MainBackground.png";
import papaiaLogo from "../assets/ic_papaia_logo_no_word.png";
import UserIcon from "../assets/user-icon.png";
import LockIcon from "../assets/lock-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";
import LoginIcon from "../assets/login-icon.png";
import { useAlert } from "../AlertContext";

export default function SignInPage() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // Form state
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation state
  const [touched, setTouched] = useState({
    usernameOrEmail: false,
    password: false,
  });

  // Reactivation state
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [deactivatedUserToken, setDeactivatedUserToken] = useState(null);

  // Preload images for better performance
  useEffect(() => {
    const images = [
      papaiaLogo,
      UserIcon,
      LockIcon,
      EyeIcon,
      EyeOffIcon,
      LoginIcon,
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Validation helper
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Get border class based on validation state
  const getFieldBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  // Handle field blur to mark as touched
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle field change to clear touched state
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "usernameOrEmail") {
      setUsernameOrEmail(value);
    } else if (fieldName === "password") {
      setPassword(value);
    }

    // Clear touched state when user starts typing
    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handle account reactivation
  const handleReactivate = async () => {
    if (!deactivatedUserToken) {
      showAlert("error", "Unable to reactivate. Please try logging in again.");
      setShowReactivationModal(false);
      return;
    }

    setLoading(true);

    try {
      // Call reactivation API
      const reactivateResponse = await fetch(
        "https://papaiaapi.onrender.com/api/reactivate",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${deactivatedUserToken}`,
          },
        }
      );

      if (!reactivateResponse.ok) {
        throw new Error("Failed to reactivate account.");
      }

      // Re-login after successful reactivation
      const loginResponse = await fetch(
        "https://papaiaapi.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: usernameOrEmail.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Failed to log in after reactivation.");
      }

      const loginData = await loginResponse.json();

      // Store credentials
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      window.dispatchEvent(new Event("userUpdated"));

      // Show success message
      showAlert("success", "Account reactivated successfully!");

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      showAlert("error", "Failed to reactivate account. Please try again.");
      setShowReactivationModal(false);
      setDeactivatedUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel reactivation
  const handleCancelReactivation = () => {
    setShowReactivationModal(false);
    setDeactivatedUserToken(null);
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      usernameOrEmail: true,
      password: true,
    });

    const trimmedEmail = usernameOrEmail.trim();
    const trimmedPassword = password.trim();

    // Validate required fields
    if (!trimmedEmail || !trimmedPassword) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    // Validate email format if @ is present
    if (trimmedEmail.includes("@") && !validateEmail(trimmedEmail)) {
      showAlert("error", "Invalid email/username or password.");
      return;
    }

    setLoading(true);
    setShowReactivationModal(false);

    try {
      // Set up request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Call login API
      const loginResponse = await fetch(
        "https://papaiaapi.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Handle failed login
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));

        if (
          errorData?.message?.toLowerCase().includes("verify") ||
          errorData?.message?.toLowerCase().includes("verified")
        ) {
          showAlert(
            "error",
            "Login Failed. Please verify your account before logging in."
          );
        } else {
          showAlert("error", "Invalid email/username or password.");
        }
        setLoading(false);
        return;
      }

      const loginData = await loginResponse.json();

      // Check if account is deactivated
      if (
        loginData.user?.status &&
        loginData.user.status.toLowerCase() === "deactivate"
      ) {
        setDeactivatedUserToken(loginData.token);
        setShowReactivationModal(true);
        setLoading(false);
        return;
      }

      // Check email verification
      if (loginData.user?.emailVerified === false) {
        showAlert(
          "error",
          "Login Failed. Please verify your account before logging in."
        );
        setLoading(false);
        return;
      }

      // Check if user is a farmer
      if (
        loginData.user?.role &&
        loginData.user.role.toLowerCase() === "farmer"
      ) {
        showAlert(
          "error",
          "Login Failed. This is a Farmer account. Only Farm Owners can access this site."
        );
        setLoading(false);
        return;
      }

      // Check if user has owner role
      const allowedRoles = ["owner"];
      if (
        loginData.user?.role &&
        !allowedRoles.includes(loginData.user.role.toLowerCase())
      ) {
        showAlert(
          "error",
          "Login Failed. This is a Farmer account. Only Farm Owners can access this site."
        );
        setLoading(false);
        return;
      }

      // Store user credentials
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      window.dispatchEvent(new Event("userUpdated"));

      // Show success message and redirect
      showAlert("success", "Login Successful!");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      if (err.name === "AbortError") {
        showAlert(
          "error",
          "Request timeout. Please check your connection and try again."
        );
      } else {
        showAlert("error", "Invalid email/username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1">
        <section className="relative h-[90vh] sm:h-[100vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 brightness-110"
            style={{ backgroundImage: `url(${MainBackground})` }}
            role="img"
            aria-label="Agricultural background"
          />

          {/* Login Form Container */}
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-xl mx-auto px-4 relative z-10 pt-15">
            <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Header Section */}
              <div className="py-6 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center rounded-t-2xl">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl mb-2 ring-4 ring-white/30">
                  <img
                    src={papaiaLogo}
                    alt="Papaia Logo"
                    className="w-7 h-9 object-contain"
                  />
                </div>
                <h1 className="text-lg font-bold text-white">Papaya Farm</h1>
                <p className="text-white/90 text-xs mt-1">
                  Welcome back to your farm dashboard
                </p>
              </div>
              {/* Form Section */}
              <div className="p-6 sm:p-8 lg:p-6 xl:p-5">
                {showReactivationModal ? (
                  // Reactivation Modal
                  <div className="space-y-5">
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xl font-bold">
                            !
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-yellow-900 mb-2">
                            Account Deactivated
                          </h3>
                          <p className="text-sm text-yellow-800 leading-relaxed">
                            Your account is currently deactivated. Would you
                            like to reactivate it now to regain full access?
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleReactivate}
                        disabled={loading}
                        className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Reactivating...
                          </>
                        ) : (
                          "Reactivate My Account"
                        )}
                      </button>

                      <button
                        onClick={handleCancelReactivation}
                        disabled={loading}
                        className="w-full h-11 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Login Form
                  <>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Username/Email Field */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                          <img src={UserIcon} alt="" className="w-4 h-4" />
                          Username or Email{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your username or email"
                          value={usernameOrEmail}
                          onChange={(e) =>
                            handleFieldChange("usernameOrEmail", e.target.value)
                          }
                          onBlur={() => handleBlur("usernameOrEmail")}
                          className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getFieldBorderClass(
                            "usernameOrEmail",
                            usernameOrEmail
                          )}`}
                          autoComplete="username"
                        />
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                          <img src={LockIcon} alt="" className="w-4 h-4" />
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                              handleFieldChange("password", e.target.value)
                            }
                            onBlur={() => handleBlur("password")}
                            className={`w-full h-11 px-4 pr-12 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getFieldBorderClass(
                              "password",
                              password
                            )}`}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <img
                              src={showPassword ? EyeOffIcon : EyeIcon}
                              alt=""
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Forgot Password Link */}
                      <div className="flex justify-end">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Login Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-[#F0820B] hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            <img src={LoginIcon} alt="" className="w-5 h-5" />
                            Login to Farm
                          </>
                        )}
                      </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                      <span className="text-gray-600 text-sm">
                        Don't have an account?{" "}
                      </span>
                      <Link
                        to="/sign-up"
                        className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors font-medium"
                      >
                        Sign up here
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterStart />
    </div>
  );
}
