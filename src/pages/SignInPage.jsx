import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import Alert from "../components/Alert";
import MainBackground from "../assets/MainBackground.png";

import papaiaLogo from "../assets/ic_papaia_logo_no_word.png";
import UserIcon from "../assets/user-icon.png";
import LockIcon from "../assets/lock-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";
import LoginIcon from "../assets/login-icon.png";

export default function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({
    usernameOrEmail: false,
    password: false,
  });
  const [reactivationPrompt, setReactivationPrompt] = useState(false);
  const [deactivatedUserToken, setDeactivatedUserToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const images = [
      PapayaLogo,
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

  const handleReactivate = async () => {
    if (!deactivatedUserToken) {
      setAlert({
        type: "error",
        message: "Unable to reactivate. Please try logging in again.",
      });
      setReactivationPrompt(false);
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
        throw new Error("Failed to reactivate account. Please try again.");
      }

      const safeEmail = usernameOrEmail.trim();
      const safePassword = password.trim();

      const loginResponse = await fetch(
        "https://papaiaapi.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: safeEmail, password: safePassword }),
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

      setAlert({
        type: "success",
        message:
          "Welcome back! Your account has been reactivated successfully.",
      });
      setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
    } catch (err) {
      console.error("Reactivation error:", err);
      setAlert({ type: "error", message: "Failed to reactivate account." });
      setReactivationPrompt(false);
      setDeactivatedUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReactivation = () => {
    setReactivationPrompt(false);
    setDeactivatedUserToken(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });
    setFieldErrors({ usernameOrEmail: false, password: false });
    setReactivationPrompt(false);

    try {
      const safeEmail = usernameOrEmail.trim();
      const safePassword = password.trim();

      if (!safeEmail || !safePassword) {
        setAlert({ type: "error", message: "All fields must be filled up." });
        setFieldErrors({
          usernameOrEmail: !safeEmail,
          password: !safePassword,
        });
        setLoading(false);
        return;
      }

      if (safeEmail.includes("@") && !validateEmail(safeEmail)) {
        setAlert({ type: "error", message: "Invalid email format." });
        setFieldErrors({ usernameOrEmail: true, password: false });
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const loginResponse = await fetch(
        "https://papaiaapi.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: safeEmail, password: safePassword }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));

        if (
          errorData.message?.toLowerCase().includes("verify") ||
          errorData.message?.toLowerCase().includes("verified")
        ) {
          setAlert({
            type: "error",
            message: "Please verify your account first.",
          });
        } else {
          setAlert({
            type: "error",
            message: "Invalid email or username or password.",
          });
          setFieldErrors({ usernameOrEmail: true, password: true });
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
        setReactivationPrompt(true);
        setLoading(false);
        return;
      }

      if (loginData.user?.emailVerified === false) {
        setAlert({
          type: "error",
          message: "Please verify your account first.",
        });
        setLoading(false);
        return;
      }

      if (
        loginData.user &&
        loginData.user.role &&
        loginData.user.role.toLowerCase() === "farmer"
      ) {
        setAlert({
          type: "error",
          message:
            "Farmers cannot login here. Please use the farmer mobile app.",
        });
        setLoading(false);
        return;
      }

      const allowedRoles = ["owner"];
      if (
        loginData.user &&
        loginData.user.role &&
        !allowedRoles.includes(loginData.user.role.toLowerCase())
      ) {
        setAlert({
          type: "error",
          message:
            "Access denied. This dashboard is only available for farm owners.",
        });
        setLoading(false);
        return;
      }

      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      }

      if (loginData.user) {
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.name === "AbortError") {
        setAlert({
          type: "error",
          message:
            "Request timeout. Please check your connection and try again.",
        });
      } else {
        setAlert({ type: "error", message: "Login failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />
      <main className="flex-1 flex justify-center items-center py-12 px-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 filter brightness-110"
          style={{ backgroundImage: `url(${MainBackground})` }}
        ></div>

        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 my-12">
          <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
            <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
                <img
                  src={papaiaLogo}
                  alt="Papaia Logo"
                  className="w-7 h-7 sm:w-8 sm:h-10 md:w-9 md:h-11"
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
              {reactivationPrompt ? (
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
                          decoding="async"
                        />
                        Username or Email *
                      </label>
                      <input
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        type="text"
                        placeholder="Enter your username or email"
                        value={usernameOrEmail}
                        onChange={(e) => {
                          setUsernameOrEmail(e.target.value);
                          setFieldErrors((prev) => ({
                            ...prev,
                            usernameOrEmail: false,
                          }));
                        }}
                        className={`w-full h-10 sm:h-11 px-3 bg-gray-50 border ${
                          fieldErrors.usernameOrEmail
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
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
                          decoding="async"
                        />
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setFieldErrors((prev) => ({
                              ...prev,
                              password: false,
                            }));
                          }}
                          className={`w-full h-10 sm:h-11 px-3 pr-10 bg-gray-50 border ${
                            fieldErrors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all`}
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
                            decoding="async"
                          />
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
                        <span className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:underline">
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
                        decoding="async"
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

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import FooterStart from "../components/Footer/FooterStart";
// import HeaderStart from "../components/Header/HeaderStart";
// import MainBackground from "../assets/MainBackground.png";

// import PapayaLogo from "../assets/ic_papaia_logo_no_word.png";
// import UserIcon from "../assets/user-icon.png";
// import LockIcon from "../assets/lock-icon.png";
// import EyeIcon from "../assets/eye-icon.png";
// import EyeOffIcon from "../assets/eye-off-icon.png";
// import LoginIcon from "../assets/login-icon.png";

// export default function SignInPage() {
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reactivationPrompt, setReactivationPrompt] = useState(false);
//   const [deactivatedUserToken, setDeactivatedUserToken] = useState(null);
//   const navigate = useNavigate();

//   // Preload all images on mount
//   useEffect(() => {
//     const images = [
//       PapayaLogo,
//       UserIcon,
//       LockIcon,
//       EyeIcon,
//       EyeOffIcon,
//       LoginIcon,
//     ];

//     images.forEach((src) => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleReactivate = async () => {
//     if (!deactivatedUserToken) {
//       setError("Unable to reactivate. Please try logging in again.");
//       setReactivationPrompt(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Step 1: Call reactivation endpoint to change status from "deactivate" to "active"
//       const reactivateResponse = await fetch(
//         "https://papaiaapi.onrender.com/api/reactivate",
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${deactivatedUserToken}`,
//           },
//         }
//       );

//       if (!reactivateResponse.ok) {
//         const errorData = await reactivateResponse.json().catch(() => ({}));
//         throw new Error(
//           errorData.error ||
//             errorData.message ||
//             "Failed to reactivate account. Please try again."
//         );
//       }

//       // Step 2: Account reactivated successfully - now log in again with the credentials
//       const safeEmail = usernameOrEmail.trim();
//       const safePassword = password.trim();

//       const loginResponse = await fetch(
//         "https://papaiaapi.onrender.com/api/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: safeEmail, password: safePassword }),
//         }
//       );

//       if (!loginResponse.ok) {
//         const errorData = await loginResponse.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || "Failed to log in after reactivation."
//         );
//       }

//       const loginData = await loginResponse.json();

//       // Step 3: Store the fresh credentials (with reactivated status)
//       if (loginData.token) {
//         localStorage.setItem("token", loginData.token);
//       }

//       if (loginData.user) {
//         localStorage.setItem("user", JSON.stringify(loginData.user));
//       }

//       // Step 4: Dispatch update event for other components
//       window.dispatchEvent(new Event("userUpdated"));

//       // Success - navigate to dashboard
//       alert("Welcome back! Your account has been reactivated successfully.");
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       console.error("Reactivation error:", err);
//       setError(err.message || "Failed to reactivate account.");
//       setReactivationPrompt(false);
//       setDeactivatedUserToken(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelReactivation = () => {
//     setReactivationPrompt(false);
//     setDeactivatedUserToken(null);
//     setError("");
//     setLoading(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setReactivationPrompt(false);

//     try {
//       const safeEmail = usernameOrEmail.trim();
//       const safePassword = password.trim();

//       // Frontend validation
//       if (!safeEmail || !safePassword) {
//         setError("All fields are required.");
//         setLoading(false);
//         return;
//       }

//       if (safeEmail.includes("@") && !validateEmail(safeEmail)) {
//         setError("Invalid email format.");
//         setLoading(false);
//         return;
//       }

//       // Login with timeout
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

//       const loginResponse = await fetch(
//         "https://papaiaapi.onrender.com/api/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: safeEmail, password: safePassword }),
//           signal: controller.signal,
//         }
//       );

//       clearTimeout(timeoutId);

//       if (!loginResponse.ok) {
//         const errorData = await loginResponse.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || "Login failed. Please check your credentials."
//         );
//       }

//       const loginData = await loginResponse.json();

//       // Check if account is deactivated
//       if (
//         loginData.user?.status &&
//         loginData.user.status.toLowerCase() === "deactivate"
//       ) {
//         setDeactivatedUserToken(loginData.token);
//         setReactivationPrompt(true);
//         setLoading(false);
//         return;
//       }

//       // Verification checks
//       if (loginData.user?.emailVerified === false) {
//         setError(
//           "Your account is not verified. Please check your email and verify your account before logging in."
//         );
//         setLoading(false);
//         return;
//       }

//       // Role validation
//       if (
//         loginData.user &&
//         loginData.user.role &&
//         loginData.user.role.toLowerCase() === "farmer"
//       ) {
//         setError(
//           "Access denied. This dashboard is only available for farm owners. Please use the farmer mobile app."
//         );
//         setLoading(false);
//         return;
//       }

//       const allowedRoles = ["owner"];
//       if (
//         loginData.user &&
//         loginData.user.role &&
//         !allowedRoles.includes(loginData.user.role.toLowerCase())
//       ) {
//         setError(
//           "Access denied. This dashboard is only available for farm owners."
//         );
//         setLoading(false);
//         return;
//       }

//       // Store credentials
//       if (loginData.token) {
//         localStorage.setItem("token", loginData.token);
//       }

//       if (loginData.user) {
//         localStorage.setItem("user", JSON.stringify(loginData.user));
//       }

//       // Navigate
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       if (err.name === "AbortError") {
//         setError(
//           "Request timeout. Please check your connection and try again."
//         );
//       } else {
//         setError(err.message || "An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <HeaderStart />
//       <main className="flex-1 flex justify-center items-center py-12 px-4 relative">
//         {/* Background */}
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 filter brightness-110"
//           style={{ backgroundImage: `url(${MainBackground})` }}
//         ></div>

//         <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 my-12">
//           <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
//             <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
//                 <img
//                   src={PapayaLogo}
//                   alt="Papaia Logo"
//                   className="w-7 h-9"
//                   loading="eager"
//                   decoding="async"
//                 />
//               </div>

//               <h1 className="text-lg sm:text-xl font-bold text-white mt-[2px]">
//                 Papaya Farm
//               </h1>
//               <p className="text-[#FDEDD3] text-xs sm:text-sm mt-1 text-center">
//                 Welcome back to your farm dashboard
//               </p>
//             </div>

//             <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
//               {/* Reactivation Prompt */}
//               {reactivationPrompt ? (
//                 <div className="space-y-4 sm:space-y-5">
//                   <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-white text-xl font-bold">!</span>
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-yellow-900 mb-1 text-sm sm:text-base">
//                           Account Deactivated
//                         </h3>
//                         <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed">
//                           Your account is currently deactivated. Would you like
//                           to reactivate it now to regain full access to your
//                           farm dashboard?
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <button
//                       onClick={handleReactivate}
//                       disabled={loading}
//                       className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Reactivating..." : "Reactivate My Account"}
//                     </button>

//                     <button
//                       onClick={handleCancelReactivation}
//                       disabled={loading}
//                       className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 border-2 border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Cancel
//                     </button>
//                   </div>

//                   {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs sm:text-sm text-center">
//                       {error}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 // Login Form
//                 <>
//                   <form
//                     className="space-y-4 sm:space-y-5 flex flex-col justify-start"
//                     onSubmit={handleSubmit}
//                   >
//                     {/* Username */}
//                     <div className="space-y-1">
//                       <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                         <img
//                           src={UserIcon}
//                           alt="Username"
//                           className="w-4 h-4"
//                           loading="eager"
//                           decoding="async"
//                         />
//                         Username or Email
//                       </label>
//                       <input
//                         id="usernameOrEmail"
//                         name="usernameOrEmail"
//                         type="text"
//                         placeholder="Enter your username or email"
//                         value={usernameOrEmail}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           setUsernameOrEmail(value);

//                           if (value.includes("@") && !validateEmail(value)) {
//                             setError("Invalid email format.");
//                           } else {
//                             setError("");
//                           }
//                         }}
//                         className="w-full h-10 sm:h-11 px-3 bg-gray-50 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                         autoComplete="username"
//                       />
//                     </div>

//                     {/* Password */}
//                     <div className="space-y-1">
//                       <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                         <img
//                           src={LockIcon}
//                           alt="Password"
//                           className="w-4 h-4"
//                           loading="eager"
//                           decoding="async"
//                         />
//                         Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           id="password"
//                           name="password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Enter your password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           className="w-full h-10 sm:h-11 px-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
//                           autoComplete="current-password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                         >
//                           <img
//                             src={showPassword ? EyeOffIcon : EyeIcon}
//                             alt={showPassword ? "Hide" : "Show"}
//                             className="w-5 h-5"
//                             loading="eager"
//                             decoding="async"
//                           />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Remember me + Forgot password */}
//                     <div className="flex items-center justify-between">
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <input
//                           type="checkbox"
//                           checked={rememberMe}
//                           onChange={(e) => setRememberMe(e.target.checked)}
//                           className="w-4 h-4 border border-gray-400 rounded-sm accent-orange-500"
//                         />
//                         <span className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:underline">
//                           Remember me
//                         </span>
//                       </label>
//                       <Link
//                         to="/forgot-password"
//                         className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline cursor-pointer transition-colors"
//                       >
//                         Forgot password?
//                       </Link>
//                     </div>

//                     {/* Submit button */}
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full h-10 sm:h-11 bg-gradient-to-r bg-[#F0820B] hover:bg-orange-600 text-white text-sm sm:text-base font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
//                     >
//                       <img
//                         src={LoginIcon}
//                         alt="Login"
//                         className="w-4 h-4 sm:w-5 sm:h-5"
//                         loading="eager"
//                         decoding="async"
//                       />
//                       {loading ? "Logging in..." : "Login to Farm"}
//                     </button>

//                     {/* Error space */}
//                     <div className="h-[11px] mt-1 flex items-center justify-center">
//                       {error && (
//                         <p className="text-red-500 text-xs text-center leading-none">
//                           {error}
//                         </p>
//                       )}
//                     </div>
//                   </form>

//                   {/* Sign up link */}
//                   <div className="text-center">
//                     <span className="text-gray-500 text-xs sm:text-sm">
//                       Don't have an account?{" "}
//                     </span>
//                     <Link
//                       to="/sign-up"
//                       className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 hover:underline transition-colors"
//                     >
//                       Sign up here
//                     </Link>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <FooterStart />
//     </div>
//   );
// }
