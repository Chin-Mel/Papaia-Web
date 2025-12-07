// SignUpPage.jsx - Updated with UserRoleModal
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import TermsAndConditionsModal from "../components/Popups/TermsAndConditionsModal";
import PrivacyPolicyModal from "../components/Popups/PrivacyPolicyModal";
import UserRoleModal from "../components/Popups/UserRoleModal";
import MainBackground from "../assets/MainBackground.png";
import papaiaLogo from "../assets/ic_papaia_logo_no_word.png";
import UserIcon from "../assets/user-icon.png";
import LockIcon from "../assets/lock-icon.png";
import MailIcon from "../assets/mail-icon.png";
import PhoneIcon from "../assets/phone-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";
import CreateUserIcon from "../assets/create-user.png";
import { useAlert } from "../AlertContext";

export default function SignUpPage() {
  const { showAlert } = useAlert();

  // Role selection state
  const [showRoleModal, setShowRoleModal] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Modal state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Touched state for validation
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Preload images
  useEffect(() => {
    const images = [
      MainBackground,
      papaiaLogo,
      UserIcon,
      LockIcon,
      MailIcon,
      PhoneIcon,
      EyeIcon,
      EyeOffIcon,
      CreateUserIcon,
    ];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
  };

  // Validation helpers
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhoneNumber = (value) =>
    /^[0-9]{10,11}$/.test(value.replace(/[\s-]/g, ""));

  // Get border class based on validation
  const getBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle field change
  const handleFieldChange = (fieldName, value, setter) => {
    setter(value);
    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  // Handle modal agree - check the checkbox
  const handleModalAgree = () => {
    setIsChecked(true);
  };

  // Register user API call
  const registerUser = async (userData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        const errorMessage =
          data?.error || data?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }
      if (error.message?.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      username: true,
      phoneNumber: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const firstNameVal = firstName.trim();
    const lastNameVal = lastName.trim();
    const usernameVal = username.trim();
    const emailVal = email.trim();
    const phoneNumberVal = phoneNumber.trim();
    const pwd = password.trim();
    const confirmPwd = confirmPassword.trim();

    // Validate required fields
    if (
      !firstNameVal ||
      !lastNameVal ||
      !usernameVal ||
      !emailVal ||
      !phoneNumberVal ||
      !pwd ||
      !confirmPwd
    ) {
      showAlert("error", "Please fill in all required fields.");
      return;
    }

    // Validate email format
    if (!validateEmail(emailVal)) {
      showAlert("error", "Invalid email format.");
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumberVal)) {
      showAlert("error", "Invalid phone number.");
      return;
    }

    // Check if passwords match
    if (pwd !== confirmPwd) {
      showAlert("error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const userData = {
      username: usernameVal,
      email: emailVal,
      password: pwd,
      role: selectedRole || "owner",
      firstName: firstNameVal,
      middleName: "",
      lastName: lastNameVal,
      suffix: "",
      birthDate: null,
      contactNumber: phoneNumberVal,
      profilePicture: "",
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      zipCode: "",
    };

    try {
      await registerUser(userData);

      showAlert(
        "success",
        "Account created successfully. Please check your email to verify your account."
      );

      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 2000);
    } catch (error) {
      if (error.message?.includes("Email already exists")) {
        showAlert(
          "error",
          "This email is already registered. Please use a different email or sign in."
        );
      } else if (error.message?.includes("Username already exists")) {
        showAlert(
          "error",
          "This username is already taken. Please choose a different username."
        );
      } else if (error.message?.includes("Server error")) {
        showAlert(
          "error",
          "The server is experiencing issues. Please try again in a few minutes."
        );
      } else if (error.message?.includes("Network error")) {
        showAlert(
          "error",
          "Connection problem. Please check your internet and try again."
        );
      } else {
        showAlert(
          "error",
          error.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      {/* User Role Modal - Overlay */}
      <UserRoleModal isOpen={showRoleModal} onSelect={handleRoleSelect} />

      <main className="flex-1 relative flex justify-center py-16 sm:py-20 px-4">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 brightness-110"
          style={{ backgroundImage: `url(${MainBackground})` }}
          role="img"
          aria-label="Agricultural background"
        />

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl relative z-10"
        >
          <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] py-6 px-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
                  <img
                    src={papaiaLogo}
                    alt="Papaia Logo"
                    className="w-8 h-10 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome!</h1>
                <p className="text-white/90 text-sm text-center">
                  Create your farm dashboard account
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={UserIcon} className="w-4 h-4" alt="" />
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      handleFieldChange(
                        "firstName",
                        e.target.value,
                        setFirstName
                      )
                    }
                    onBlur={() => handleBlur("firstName")}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                      "firstName",
                      firstName
                    )}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={UserIcon} className="w-4 h-4" alt="" />
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value, setLastName)
                    }
                    onBlur={() => handleBlur("lastName")}
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                      "lastName",
                      lastName
                    )}`}
                  />
                </div>
              </div>

              {/* Username & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={UserIcon} className="w-4 h-4" alt="" />
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      handleFieldChange("username", e.target.value, setUsername)
                    }
                    onBlur={() => handleBlur("username")}
                    placeholder="Choose username"
                    autoComplete="username"
                    className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                      "username",
                      username
                    )}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={PhoneIcon} className="w-4 h-4" alt="" />
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      handleFieldChange(
                        "phoneNumber",
                        e.target.value,
                        setPhoneNumber
                      )
                    }
                    onBlur={() => handleBlur("phoneNumber")}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                      "phoneNumber",
                      phoneNumber
                    )}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <img src={MailIcon} className="w-4 h-4" alt="" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    handleFieldChange("email", e.target.value, setEmail)
                  }
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter email address"
                  autoComplete="email"
                  className={`w-full h-11 px-4 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                    "email",
                    email
                  )}`}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={LockIcon} className="w-4 h-4" alt="" />
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        handleFieldChange(
                          "password",
                          e.target.value,
                          setPassword
                        )
                      }
                      onBlur={() => handleBlur("password")}
                      placeholder="Enter password"
                      autoComplete="new-password"
                      className={`w-full h-11 px-4 pr-12 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "password",
                        password
                      )}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <img
                        src={showPassword ? EyeOffIcon : EyeIcon}
                        alt=""
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img src={LockIcon} className="w-4 h-4" alt="" />
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        handleFieldChange(
                          "confirmPassword",
                          e.target.value,
                          setConfirmPassword
                        )
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className={`w-full h-11 px-4 pr-12 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "confirmPassword",
                        confirmPassword
                      )}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <img
                        src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                        alt=""
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Privacy */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl border-2 border-orange-200">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-green-700 font-semibold underline hover:text-green-900"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-orange-700 font-semibold underline hover:text-orange-900"
                    onClick={() => setShowPrivacyModal(true)}
                  >
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isChecked || isLoading}
                className="w-full h-12 bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <img src={CreateUserIcon} alt="" className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>

        {/* Modals */}
        <TermsAndConditionsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAgree={handleModalAgree}
        />

        <PrivacyPolicyModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          onAgree={handleModalAgree}
        />
      </main>

      <FooterStart />
    </div>
  );
}

// import { Link } from "react-router-dom";
// import { useState, useRef, useEffect, useMemo } from "react";
// import FooterStart from "../components/Footer/FooterStart";
// import HeaderStart from "../components/Header/HeaderStart";
// import TermsAndConditionsModal from "../components/Popups/TermsAndConditionsModal";
// import PrivacyPolicyModal from "../components/Popups/PrivacyPolicyModal";
// import UserRoleModal from "../components/Popups/UserRoleModal";
// import { ChevronDown, User, Lock, Tag } from "lucide-react";
// import UserIcon from "../assets/user-icon.png";
// import LockIcon from "../assets/lock-icon.png";
// import MailIcon from "../assets/mail-icon.png";
// import PhoneIcon from "../assets/phone-icon.png";
// import { Eye, EyeOff } from "lucide-react";
// import Alert from "../components/Alert";
// import MainBackground from "../assets/MainBackground.png";
// import papaiaLogo from "../assets/ic_papaia_logo_no_word.png";

// import CreateUserIcon from "../assets/create-user.png";

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
//     <div className="relative min-w-[120px]" ref={dropdownRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full h-10 px-4 border-2 border-gray-200 rounded-xl flex justify-between items-center text-sm bg-white/90 hover:bg-white hover:border-orange-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
//       >
//         <span className={value ? "text-gray-900" : "text-gray-400"}>
//           {value || "Select"}
//         </span>
//         <ChevronDown
//           className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {isOpen && (
//         <ul className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
//           {options.map((option, index) => (
//             <li
//               key={`${option}-${index}`}
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="px-4 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-green-600 hover:to-orange-500 hover:text-white text-sm transition-all duration-150 first:rounded-t-xl last:rounded-b-xl"
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
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [showPrivacyModal, setShowPrivacyModal] = useState(false);
//   const [showRoleModal, setShowRoleModal] = useState(true); // show on page load
//   const [farmerMessage, setFarmerMessage] = useState("");
//   const [alert, setAlert] = useState({ type: "", message: "" });

//   const handleRoleSelect = (role) => {
//     if (role === "farmer") {
//       setFarmerMessage("Please install the Papaia mobile app to continue.");

//       // Automatically clear message after 7 seconds
//       setTimeout(() => {
//         setFarmerMessage("");
//       }, 3000);
//     } else if (role === "owner") {
//       setShowRoleModal(false); // close modal, reveal full signup form
//     }
//   };
//   const [formErrors, setFormErrors] = useState({
//     lastName: "",
//     firstName: "",
//     username: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//   });

//   useEffect(() => {
//     const images = [MainBackground, papaiaLogo, CreateUserIcon];
//     images.forEach((src) => {
//       const img = new Image();
//       img.src = src;
//     });
//   }, []);

//   const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const inputClasses = (hasError) => `
//   w-full h-10 px-4 text-sm
//   bg-white/90 border-2 rounded-xl
//   transition-all duration-200
//   placeholder:text-gray-400
//   focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white
//   hover:bg-white hover:border-orange-300
//   ${
//     hasError
//       ? "border-red-400 focus:ring-red-400 focus:border-red-400"
//       : "border-gray-200"
//   }
// `;

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
//     const timeoutId = setTimeout(() => controller.abort(), 20000);

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
//       if (error.message?.includes("fetch")) {
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

//       setAlert({
//         type: "success",
//         message: successMessage,
//       });

//       setTimeout(() => {
//         window.location.href = "/sign-in";
//       }, 2000);
//     } catch (error) {
//       if (
//         error.message?.includes("Email already exists") ||
//         error.message?.includes("Username already exists")
//       ) {
//         setError(error.message);
//       } else if (error.message?.includes("Server error")) {
//         setError(
//           "The server is experiencing issues. Please try again in a few minutes."
//         );
//       } else if (error.message?.includes("Network error")) {
//         setError(
//           "Connection problem. Please check your internet and try again."
//         );
//       } else if (error.message?.includes("provide all required fields")) {
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
//       <Alert
//         type={alert.type}
//         message={alert.message}
//         onClose={() => setAlert({ type: "", message: "" })}
//       />
//       <main className="flex-1 relative flex justify-center py-12 px-4">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 filter brightness-110"
//           style={{
//             backgroundImage: `url(${MainBackground})`,
//           }}
//         ></div>

//         <form
//           onSubmit={handleSubmit}
//           className="w-full max-w-6xl relative z-10 my-12"
//         >
//           <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-0 ">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] py-6 px-6">
//               <div className="flex flex-col items-center">
//                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
//                   <img
//                     src={papaiaLogo}
//                     alt="Papaia Logo"
//                     className="w-7 h-7 sm:w-8 sm:h-10 md:w-9 md:h-11"
//                   />
//                 </div>
//                 <h1 className="text-2xl font-bold text-white mb-1">Welcome!</h1>
//                 <p className="text-white/90 text-sm text-center max-w-md">
//                   Create your farm dashboard account
//                 </p>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="w-full flex justify-center">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full px-4 max-w-6xl relative">
//                   <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-gray-300 -translate-x-1/2"></div>
//                   {/* Personal Information Column */}
//                   <div className="flex flex-col items-center lg:items-start lg:pr-6">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
//                         <User className="w-5 h-5 text-white" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">
//                         Personal Information
//                       </h2>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={UserIcon}
//                               className="w-4 h-4"
//                               alt="First Name"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             First Name <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="firstName"
//                               name="firstName"
//                               type="text"
//                               value={firstName}
//                               onChange={(e) => setFirstName(e.target.value)}
//                               placeholder="Enter first name"
//                               autoComplete="given-name"
//                               className={inputClasses(formErrors.firstName)}
//                             />
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={UserIcon}
//                               className="w-4 h-4"
//                               alt="Last Name"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Middle Name
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="middleName"
//                               name="middleName"
//                               type="text"
//                               value={middleName}
//                               onChange={(e) => setMiddleName(e.target.value)}
//                               placeholder="Enter middle name"
//                               autoComplete="middle-name"
//                               className={inputClasses(false)}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={UserIcon}
//                               className="w-4 h-4"
//                               alt="Middle Name"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Last Name <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="lastName"
//                               name="lastName"
//                               type="text"
//                               value={lastName}
//                               onChange={(e) => setLastName(e.target.value)}
//                               placeholder="Enter last name"
//                               autoComplete="family-name"
//                               className={inputClasses(formErrors.lastName)}
//                             />
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={UserIcon}
//                               className="w-4 h-4"
//                               alt="Suffix"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Suffix
//                           </label>
//                           <SuffixDropdown value={suffix} onChange={setSuffix} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Account Information Column */}
//                   <div className="lg:pl-6 flex flex-col items-center lg:items-start">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
//                         <Lock className="w-5 h-5 text-white" />
//                       </div>
//                       <h2 className="text-lg font-bold text-gray-800">
//                         Account Information
//                       </h2>
//                     </div>

//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={UserIcon}
//                               className="w-4 h-4"
//                               alt="Username"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Username <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="username"
//                               name="username"
//                               type="text"
//                               value={username}
//                               onChange={(e) => setUsername(e.target.value)}
//                               placeholder="Choose username"
//                               autoComplete="username"
//                               className={inputClasses(formErrors.username)}
//                             />
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={PhoneIcon}
//                               className="w-4 h-4"
//                               alt="Phone Number"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Phone Number <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="phoneNumber"
//                               name="phoneNumber"
//                               type="tel"
//                               value={phoneNumber}
//                               onChange={(e) => setPhoneNumber(e.target.value)}
//                               placeholder="Enter phone number"
//                               autoComplete="tel"
//                               className={inputClasses(formErrors.phoneNumber)}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-2 col-span-full">
//                         <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                           <img
//                             src={MailIcon}
//                             className="w-4 h-4"
//                             alt="Email"
//                             loading="eager"
//                             decoding="async"
//                           />
//                           Email Address <span className="text-red-500">*</span>
//                         </label>
//                         <div className="relative max-w-full">
//                           <input
//                             id="email"
//                             name="email"
//                             type="email"
//                             value={email}
//                             placeholder="Enter email address"
//                             autoComplete="email"
//                             className={inputClasses(formErrors.email)}
//                             onChange={handleChange}
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={LockIcon}
//                               className="w-4 h-4"
//                               alt="Password"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Password <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="password"
//                               name="password"
//                               type={showPassword ? "text" : "password"}
//                               placeholder="Enter password"
//                               value={password}
//                               autoComplete="new-password"
//                               onChange={handlePasswordChange}
//                               className={inputClasses(formErrors.password)}
//                             />
//                             <button
//                               type="button"
//                               onClick={() => setShowPassword(!showPassword)}
//                               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                               {showPassword ? (
//                                 <EyeOff className="w-5 h-5" />
//                               ) : (
//                                 <Eye className="w-5 h-5" />
//                               )}
//                             </button>
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                             <img
//                               src={LockIcon}
//                               className="w-4 h-4"
//                               alt="Confirm Password"
//                               loading="eager"
//                               decoding="async"
//                             />
//                             Confirm Password{" "}
//                             <span className="text-red-500">*</span>
//                           </label>
//                           <div className="relative">
//                             <input
//                               id="confirmPassword"
//                               name="confirmPassword"
//                               type={showConfirmPassword ? "text" : "password"}
//                               placeholder="Confirm password"
//                               value={confirmPassword}
//                               autoComplete="new-password"
//                               onChange={handleConfirmPasswordChange}
//                               className={inputClasses(
//                                 formErrors.confirmPassword ||
//                                   confirmPasswordError
//                               )}
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setShowConfirmPassword(!showConfirmPassword)
//                               }
//                               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                               {showConfirmPassword ? (
//                                 <EyeOff className="w-5 h-5" />
//                               ) : (
//                                 <Eye className="w-5 h-5" />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-start gap-3 p-5 mt-7 bg-gradient-to-r from-green-50 to-orange-50 mb-5 rounded-2xl border-2 border-orange-200">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={isChecked}
//                   onChange={(e) => setIsChecked(e.target.checked)}
//                   className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded-lg cursor-pointer"
//                 />

//                 <p className="text-sm text-gray-700">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     className="text-green-700 font-semibold underline hover:text-green-900"
//                     onClick={() => setShowTermsModal(true)}
//                   >
//                     Terms and Conditions
//                   </button>{" "}
//                   and{" "}
//                   <button
//                     type="button"
//                     className="text-orange-700 font-semibold underline hover:text-orange-900"
//                     onClick={() => setShowPrivacyModal(true)}
//                   >
//                     Privacy Policy
//                   </button>
//                   .
//                 </p>
//               </div>

//               {/* Error Message */}
//               {(error ||
//                 confirmPasswordError ||
//                 Object.values(formErrors).find((err) => err)) && (
//                 <p className="text-sm text-red-700 text-center font-semibold mb-4">
//                   {error ||
//                     confirmPasswordError ||
//                     "Please fill in all required fields."}
//                 </p>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={!isChecked || isLoading}
//                 className={`
//                   w-full h-12
//                   bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
//                   text-base font-bold text-white
//                   rounded-xl shadow-lg
//                   flex items-center justify-center gap-2
//                   transition-all duration-200
//                   ${
//                     !isChecked || isLoading
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
//                   }
//                 `}
//               >
//                 <img
//                   src={CreateUserIcon}
//                   alt="Create"
//                   className="w-5 h-5"
//                   loading="eager"
//                   decoding="async"
//                 />
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </button>

//               {/* Sign In Link */}
//               <p className="text-center text-sm text-gray-600 pt-2">
//                 Already have an account?{" "}
//                 <Link
//                   to="/sign-in"
//                   className="text-orange-600 hover:text-orange-700 font-bold hover:underline underline-offset-2 transition-colors"
//                 >
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </form>
//         {/* User Role Modal */}
//         {showRoleModal && (
//           <>
//             {/* Overlay + blur */}
//             <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
//             <UserRoleModal isOpen={showRoleModal} onSelect={handleRoleSelect} />
//           </>
//         )}

//         {/* Farmer Message */}
//         {farmerMessage && (
//           <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-yellow-900 p-4 rounded-lg z-50 shadow-lg">
//             {farmerMessage}
//           </div>
//         )}
//         <TermsAndConditionsModal
//           isOpen={showTermsModal}
//           onClose={() => setShowTermsModal(false)}
//         />

//         <PrivacyPolicyModal
//           isOpen={showPrivacyModal}
//           onClose={() => setShowPrivacyModal(false)}
//         />
//       </main>

//       <FooterStart />
//     </div>
//   );
// }
