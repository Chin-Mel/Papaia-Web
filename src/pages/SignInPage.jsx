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

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    usernameOrEmail: false,
    password: false,
  });

  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [deactivatedUserToken, setDeactivatedUserToken] = useState(null);

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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getFieldBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "usernameOrEmail") {
      setUsernameOrEmail(value);
    } else if (fieldName === "password") {
      setPassword(value);
    }

    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleReactivate = async () => {
    if (!deactivatedUserToken) {
      showAlert("error", "Unable to reactivate. Please try logging in again.");
      setShowReactivationModal(false);
      return;
    }

    setLoading(true);

    try {
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

      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      window.dispatchEvent(new Event("userUpdated"));

      showAlert("success", "Account reactivated successfully!");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      showAlert("error", "Failed to reactivate account. Please try again.");
      setShowReactivationModal(false);
      setDeactivatedUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReactivation = () => {
    setShowReactivationModal(false);
    setDeactivatedUserToken(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      usernameOrEmail: true,
      password: true,
    });

    const trimmedEmail = usernameOrEmail.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    if (trimmedEmail.includes("@") && !validateEmail(trimmedEmail)) {
      showAlert("error", "Invalid email/username or password.");
      return;
    }

    setLoading(true);
    setShowReactivationModal(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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

      if (
        loginData.user?.status &&
        loginData.user.status.toLowerCase() === "deactivate"
      ) {
        setDeactivatedUserToken(loginData.token);
        setShowReactivationModal(true);
        setLoading(false);
        return;
      }

      if (loginData.user?.emailVerified === false) {
        showAlert(
          "error",
          "Login Failed. Please verify your account before logging in."
        );
        setLoading(false);
        return;
      }

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

      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      window.dispatchEvent(new Event("userUpdated"));

      showAlert("success", "Login Successful!");

      navigate("/dashboard", { replace: true });
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

      <main className="flex-1 py-12 px-4 relative h-[90vh] sm:h-[100vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 filter brightness-110"
          style={{
            backgroundImage: `url(${MainBackground})`,
          }}
        ></div>

        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 my-12">
          <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
            <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
                <img
                  src={papaiaLogo}
                  alt="Papaia Logo"
                  className="w-4 h-6 sm:w-5 sm:h-7 md:w-6 md:h-8"
                  loading="eager"
                />
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-white mt-[2px]">
                Papaya Farm
              </h1>
              <p className="text-[#FDEDD3] text-xs sm:text-sm mt-1 text-center">
                Welcome back to your farm dashboard
              </p>
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
              {showReactivationModal ? (
                <div className="space-y-4 sm:space-y-5">
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl font-bold">!</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-yellow-900 mb-1 text-sm sm:text-base">
                          Account Deactivated
                        </h3>
                        <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
                          Your account is currently deactivated. Would you like
                          to reactivate it now to regain full access to your
                          farm dashboard?
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleReactivate}
                      disabled={loading}
                      className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Reactivating..." : "Reactivate My Account"}
                    </button>

                    <button
                      onClick={handleCancelReactivation}
                      disabled={loading}
                      className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 border-2 border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <form
                    className="space-y-4 sm:space-y-5 flex flex-col justify-start"
                    onSubmit={handleSubmit}
                  >
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                        <img
                          src={UserIcon}
                          alt="Username"
                          className="w-4 h-4"
                          loading="eager"
                        />
                        Username or Email *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username or email"
                        value={usernameOrEmail}
                        onChange={(e) =>
                          handleFieldChange("usernameOrEmail", e.target.value)
                        }
                        onBlur={() => handleBlur("usernameOrEmail")}
                        className={`w-full h-10 sm:h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getFieldBorderClass(
                          "usernameOrEmail",
                          usernameOrEmail
                        )}`}
                        autoComplete="username"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                        <img
                          src={LockIcon}
                          alt="Password"
                          className="w-4 h-4"
                          loading="eager"
                        />
                        Password *
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
                          className={`w-full h-10 sm:h-11 px-3 pr-10 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getFieldBorderClass(
                            "password",
                            password
                          )}`}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <img
                            src={showPassword ? EyeOffIcon : EyeIcon}
                            alt={showPassword ? "Hide" : "Show"}
                            className="w-5 h-5"
                            loading="eager"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 bg-gradient-to-r bg-[#F0820B] hover:bg-orange-600 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <img
                        src={LoginIcon}
                        alt="Login"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        loading="eager"
                      />
                      {loading ? "Logging in..." : "Login to Farm"}
                    </button>
                  </form>

                  <div className="text-center">
                    <span className="text-gray-500 text-xs sm:text-sm">
                      Don't have an account?{" "}
                    </span>
                    <Link
                      to="/sign-up"
                      className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors"
                    >
                      Sign up here
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <FooterStart />
    </div>
  );
}
