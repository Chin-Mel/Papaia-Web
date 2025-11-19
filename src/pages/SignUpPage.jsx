//new
import { useState, useEffect } from "react";
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

export default function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Preload all images on mount
  useEffect(() => {
    const images = [
      BackgroundImage,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const safeEmail = usernameOrEmail.trim();
      const safePassword = password.trim();

      // Frontend validation
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

      // Login with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
        throw new Error(
          errorData.message || "Login failed. Please check your credentials."
        );
      }

      const loginData = await loginResponse.json();

      // Verification checks
      if (loginData.user?.emailVerified === false) {
        setError(
          "Your account is not verified. Please check your email and verify your account before logging in."
        );
        setLoading(false);
        return;
      }

      // Role validation
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

      // Store only the token - NEVER store user data in localStorage
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
      } else {
        throw new Error("No authentication token received");
      }

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.name === "AbortError") {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1 relative flex justify-center items-center py-20 sm:py-24">
        {/* Optimized Background with CSS */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            filter: "blur(2px)",
            opacity: 0.95,
            willChange: "transform",
          }}
        />

        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
            <div className="h-36 sm:h-40 bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                <img
                  src={PapayaLogo}
                  alt="Papaia Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-white font-['Inter'] mt-[2px]">
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
                    <img
                      src={UserIcon}
                      alt="Username"
                      className="w-4 h-4"
                      loading="eager"
                      decoding="async"
                    />
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
                    autoComplete="username"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
                    <img
                      src={LockIcon}
                      alt="Password"
                      className="w-4 h-4"
                      loading="eager"
                      decoding="async"
                    />
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

                {/* Remember me + Forgot password */}
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
                    loading="eager"
                    decoding="async"
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

// import { Link } from "react-router-dom";
// import { useState, useRef, useEffect, useMemo } from "react";
// import FooterStart from "../components/Footer/FooterStart";
// import HeaderStart from "../components/Header/HeaderStart";
// import { ChevronDown } from "lucide-react";

// import BackgroundImage from "../assets/hero-background.png";
// import PapayaLogo from "../assets/papaia-logo.png";
// import UserIcon from "../assets/user-icon.png";
// import CreateUserIcon from "../assets/create-user.png";
// import TagIcon from "../assets/tag-icon.png";
// import MailIcon from "../assets/mail-icon.png";
// import AtsignIcon from "../assets/atsign-icon.png";
// import LockIcon from "../assets/lock-icon.png";
// import EyeIcon from "../assets/eye-icon.png";
// import EyeOffIcon from "../assets/eye-off-icon.png";
// import CalendarIcon from "../assets/calendar-icon.png";
// import PhoneIcon from "../assets/phone-icon.png";

// function SuffixDropdown({ value, onChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const options = useMemo(() => ["", "Jr.", "Sr.", "II", "III"], []);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative min-w-[120px] sm:min-w-[140px]" ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full h-12 px-3 sm:px-4 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base bg-white hover:bg-gray-100 transition-all duration-150 active:scale-95 cursor-pointer"
//       >
//         {value || "Select suffix"}
//         <ChevronDown className="w-4 h-4 text-gray-400" />
//       </button>

//       {isOpen && (
//         <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
//           {options.map((option, index) => (
//             <li
//               key={`${option}-${index}`}
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base"
//             >
//               {option || "None"}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default function SignUpPage() {
//   const [lastName, setLastName] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [middleName, setMiddleName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [error, setError] = useState("");
//   const [isChecked, setIsChecked] = useState(false);
//   const [suffix, setSuffix] = useState("");
//   const [dob, setDob] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [confirmPasswordError, setConfirmPasswordError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [formErrors, setFormErrors] = useState({
//     lastName: "",
//     firstName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//   });

//   // Preload all images on mount
//   useEffect(() => {
//     const images = [
//       BackgroundImage,
//       PapayaLogo,
//       UserIcon,
//       CreateUserIcon,
//       TagIcon,
//       MailIcon,
//       AtsignIcon,
//       LockIcon,
//       EyeIcon,
//       EyeOffIcon,
//       CalendarIcon,
//       PhoneIcon,
//     ];

//     images.forEach((src) => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//   // Memoize max date calculation
//   const maxDate = useMemo(() => {
//     return new Date(
//       new Date().getFullYear() - 18,
//       new Date().getMonth(),
//       new Date().getDate()
//     )
//       .toISOString()
//       .split("T")[0];
//   }, []);

//   const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const handlePasswordChange = (e) => {
//     const value = e.target.value;
//     setPassword(value);
//     if (confirmPassword && confirmPassword !== value) {
//       setConfirmPasswordError("Passwords do not match");
//     } else {
//       setConfirmPasswordError("");
//     }
//   };

//   const handleConfirmPasswordChange = (e) => {
//     const value = e.target.value;
//     setConfirmPassword(value);

//     if (password && password !== value) {
//       setConfirmPasswordError("Passwords do not match");
//     } else {
//       setConfirmPasswordError("");
//     }
//   };

//   const registerUser = async (userData) => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

//     try {
//       const response = await fetch("https://papaiaapi.onrender.com/api/user", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       let data;
//       try {
//         data = await response.json();
//       } catch (jsonError) {
//         throw new Error("Invalid response from server");
//       }

//       if (!response.ok) {
//         const errorMessage =
//           data?.error || data?.message || `HTTP ${response.status}`;
//         throw new Error(errorMessage);
//       }

//       return data;
//     } catch (error) {
//       if (error.name === "AbortError") {
//         throw new Error("Request timeout. Please try again.");
//       }
//       if (error.message.includes("fetch")) {
//         throw new Error("Network error. Please check your connection.");
//       }
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     const errors = {};

//     const lastNameVal = lastName.trim();
//     const firstNameVal = firstName.trim();
//     const middleNameVal = middleName.trim();
//     const usernameVal = username.trim();
//     const emailVal = email.trim();
//     const phoneNumberVal = phoneNumber.trim();
//     const pwd = password.trim();
//     const confirmPwd = confirmPassword.trim();

//     // Validation
//     if (!lastNameVal) errors.lastName = "Last name is required";
//     if (!firstNameVal) errors.firstName = "First name is required";
//     if (!usernameVal) errors.username = "Username is required";
//     if (!emailVal) errors.email = "Email is required";
//     else if (!validateEmail(emailVal)) errors.email = "Invalid email format";
//     if (!phoneNumberVal) errors.phoneNumber = "Phone number is required";
//     if (!pwd) errors.password = "Password is required";
//     if (!confirmPwd) errors.confirmPassword = "Confirm your password";
//     else if (pwd !== confirmPwd)
//       errors.confirmPassword = "Passwords do not match";

//     setFormErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       setError("Please fix the errors above.");
//       setIsLoading(false);
//       return;
//     }

//     if (!isChecked) {
//       setError("You must agree to the terms first.");
//       setIsLoading(false);
//       return;
//     }

//     let formattedBirthDate = "";
//     if (dob) {
//       try {
//         const dateParts = dob.split("-");
//         if (dateParts.length === 3) {
//           const [year, month, day] = dateParts;
//           formattedBirthDate = `${month}-${day}-${year}`;
//         } else {
//           throw new Error("Invalid date format");
//         }
//       } catch (dateError) {
//         setError("Invalid date format. Please select a valid date.");
//         setIsLoading(false);
//         return;
//       }
//     }

//     const userData = {
//       username: usernameVal,
//       email: emailVal,
//       password: pwd,
//       role: "owner",
//       firstName: firstNameVal,
//       middleName: middleNameVal || "",
//       lastName: lastNameVal,
//       suffix: suffix || "",
//       birthDate: formattedBirthDate || null,
//       contactNumber: phoneNumberVal,
//       profilePicture: "",
//       street: "",
//       barangay: "",
//       municipality: "",
//       province: "",
//       zipCode: "",
//     };

//     try {
//       const result = await registerUser(userData);

//       setError("");

//       const successMessage =
//         result.message ||
//         "Account created successfully! Please check your email to verify your account.";
//       alert(successMessage);

//       window.location.href = "/sign-in";
//     } catch (error) {
//       if (
//         error.message.includes("Email already exists") ||
//         error.message.includes("Username already exists")
//       ) {
//         setError(error.message);
//       } else if (error.message.includes("Server error")) {
//         setError(
//           "The server is experiencing issues. Please try again in a few minutes."
//         );
//       } else if (error.message.includes("Network error")) {
//         setError(
//           "Connection problem. Please check your internet and try again."
//         );
//       } else if (error.message.includes("provide all required fields")) {
//         setError("Please fill in all required fields.");
//       } else {
//         setError(error.message || "Registration failed. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "email") {
//       setEmail(value);
//       if (!value) setError("Email is required");
//       else if (!validateEmail(value)) setError("Wrong email format");
//       else setError("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <HeaderStart />

//       <main className="flex-1 relative flex justify-center py-20 sm:py-24 px-2 sm:px-4">
//         {/* Optimized Background */}
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: `url(${BackgroundImage})`,
//             willChange: "transform",
//           }}
//         />

//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-7xl relative z-10"
//         >
//           <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
//             {/* Gradient Header */}
//             <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center py-4 sm:py-6 px-4">
//               <div className="w-12 h-12 sm:w-11 sm:h-11 lg:w-13 lg:h-13 bg-white rounded-full flex items-center justify-center shadow-md">
//                 <img
//                   src={PapayaLogo}
//                   alt="Papaia Logo"
//                   className="w-8 h-8 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
//                   loading="eager"
//                   decoding="async"
//                 />
//               </div>
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2">
//                 Sign Up
//               </h1>
//               <p className="text-[#FDEDD3] text-xs sm:text-sm lg:text-base mt-1 text-center">
//                 Create your farm dashboard account
//               </p>
//             </div>

//             {/* Form */}
//             <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 lg:space-y-6">
//               {/* Row 1: Name Fields */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={UserIcon}
//                       alt="User"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Last Name
//                   </label>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                     placeholder="Enter last name"
//                     autoComplete="family-name"
//                     className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                       formErrors.lastName ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                 </div>
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={UserIcon}
//                       alt="User"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     First Name
//                   </label>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                     placeholder="Enter first name"
//                     autoComplete="given-name"
//                     className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                       formErrors.firstName
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={UserIcon}
//                       alt="User"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Middle Name
//                   </label>
//                   <input
//                     id="middleName"
//                     name="middleName"
//                     type="text"
//                     value={middleName}
//                     onChange={(e) => setMiddleName(e.target.value)}
//                     placeholder="Enter middle name"
//                     autoComplete="middle-name"
//                     className="w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={TagIcon}
//                       alt="Tag"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Suffix
//                   </label>
//                   <SuffixDropdown value={suffix} onChange={setSuffix} />
//                 </div>
//                 <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={CalendarIcon}
//                       alt="Calendar"
//                       className="w-4 h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Date of Birth
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       value={dob}
//                       onChange={(e) => setDob(e.target.value)}
//                       max={maxDate}
//                       className="w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Username, Email, Phone */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={AtsignIcon}
//                       alt="User"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Username
//                   </label>
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="Choose username"
//                     autoComplete="username"
//                     className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                       formErrors.username ? "border-red-500" : "border-gray-300"
//                     }`}
//                   />
//                 </div>

//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={MailIcon}
//                       alt="Mail"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Email Address
//                   </label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={email}
//                     placeholder="Enter email address"
//                     autoComplete="email"
//                     className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                       formErrors.email ? "border-red-500" : "border-gray-300"
//                     }`}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={PhoneIcon}
//                       alt="Phone"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Phone Number
//                   </label>
//                   <input
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     type="tel"
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     placeholder="Enter phone number"
//                     autoComplete="tel"
//                     className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                       formErrors.phoneNumber
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                   />
//                 </div>
//               </div>

//               {/* Passwords */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={LockIcon}
//                       alt="Lock"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter password"
//                       value={password}
//                       autoComplete="new-password"
//                       onChange={handlePasswordChange}
//                       className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 pr-10 sm:pr-12 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                         formErrors.password
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
//                     >
//                       <img
//                         src={showPassword ? EyeOffIcon : EyeIcon}
//                         alt={showPassword ? "Hide Password" : "Show Password"}
//                         className="w-4 h-4 sm:w-5 sm:h-4"
//                         loading="eager"
//                         decoding="async"
//                       />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-1 sm:space-y-2">
//                   <label className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm font-medium">
//                     <img
//                       src={LockIcon}
//                       alt="Lock"
//                       className="w-3 h-3 sm:w-4 sm:h-4"
//                       loading="eager"
//                       decoding="async"
//                     />
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm password"
//                       value={confirmPassword}
//                       autoComplete="new-password"
//                       onChange={handleConfirmPasswordChange}
//                       className={`w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 pr-10 sm:pr-12 text-sm sm:text-base bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
//                         formErrors.confirmPassword || confirmPasswordError
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
//                     >
//                       <img
//                         src={showConfirmPassword ? EyeOffIcon : EyeIcon}
//                         alt={
//                           showConfirmPassword
//                             ? "Hide Password"
//                             : "Show Password"
//                         }
//                         className="w-4 h-4 sm:w-5 sm:h-4"
//                         loading="eager"
//                         decoding="async"
//                       />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="hidden lg:block"></div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-start gap-2 sm:gap-3 mt-4 sm:mt-5 lg:mt-7">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={isChecked}
//                   onChange={(e) => setIsChecked(e.target.checked)}
//                   className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 border border-gray-400 rounded-sm accent-orange-500 cursor-pointer flex-shrink-0"
//                 />
//                 <label
//                   htmlFor="terms"
//                   className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed"
//                 >
//                   I agree to the{" "}
//                   <Link
//                     to="/terms"
//                     className="text-orange-500 hover:underline font-medium"
//                   >
//                     Terms of Service
//                   </Link>{" "}
//                   and{" "}
//                   <Link
//                     to="/privacy"
//                     className="text-orange-500 hover:underline font-medium"
//                   >
//                     Privacy Policy
//                   </Link>
//                 </label>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={!isChecked || isLoading}
//                 className={`transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full mt-4 sm:mt-5 lg:mt-6 h-11 sm:h-12 lg:h-14 bg-gradient-to-r bg-[#F97316] text-sm sm:text-base lg:text-lg font-semibold text-white rounded-lg shadow-lg flex items-center justify-center gap-2
//                 ${
//                   !isChecked || isLoading
//                     ? "opacity-50 cursor-not-allowed hover:bg-[#F97316]"
//                     : "hover:bg-orange-600"
//                 }`}
//               >
//                 <img
//                   src={CreateUserIcon}
//                   alt="Create Account"
//                   className="w-4 h-4 sm:w-5 sm:h-5"
//                   loading="eager"
//                   decoding="async"
//                 />
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </button>

//               <div className="min-h-[16px] sm:min-h-[20px] mt-2 sm:mt-3 text-center text-red-500 text-xs sm:text-sm">
//                 {error
//                   ? error
//                   : confirmPasswordError
//                   ? confirmPasswordError
//                   : Object.values(formErrors).find((err) => err)
//                   ? "Please fill in all required fields."
//                   : null}
//               </div>

//               {/* Sign In */}
//               <p className="text-center mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm lg:text-base">
//                 Already have an account?{" "}
//                 <Link
//                   to="/sign-in"
//                   className="text-orange-500 hover:underline font-medium"
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </form>
//       </main>

//       <FooterStart />
//     </div>
//   );
// }
