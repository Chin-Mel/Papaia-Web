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
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}
      <UserRoleModal isOpen={showRoleModal} onSelect={handleRoleSelect} />

      <main className="flex-1">
        <section className="relative h-[90vh] sm:h-[100vh] flex items-center justify-center overflow-hidden">
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
            className="w-full max-w-2xl relative z-10 pt-17"
          >
            <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] py-3 px-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 ring-2 ring-white/30">
                    <img
                      src={papaiaLogo}
                      alt="Papaia Logo"
                      className="w-6 h-8 object-contain"
                    />
                  </div>
                  <h1 className="text-lg font-bold text-white">Welcome!</h1>
                  <p className="text-white/90 text-xs text-center">
                    Create your farm dashboard account
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-5 space-y-3">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
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
                      className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "firstName",
                        firstName
                      )}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      <img src={UserIcon} className="w-4 h-4" alt="" />
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) =>
                        handleFieldChange(
                          "lastName",
                          e.target.value,
                          setLastName
                        )
                      }
                      onBlur={() => handleBlur("lastName")}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "lastName",
                        lastName
                      )}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      <img src={UserIcon} className="w-4 h-4" alt="" />
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) =>
                        handleFieldChange(
                          "username",
                          e.target.value,
                          setUsername
                        )
                      }
                      onBlur={() => handleBlur("username")}
                      placeholder="Choose username"
                      autoComplete="username"
                      className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "username",
                        username
                      )}`}
                    />
                  </div>
                </div>

                {/* Username & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
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
                      className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "email",
                        email
                      )}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
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
                      className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
                        "phoneNumber",
                        phoneNumber
                      )}`}
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
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
                        className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
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

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
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
                        className={`w-full h-11 px-3 bg-gray-50 border rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${getBorderClass(
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
                <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border-2 border-orange-200">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-orange-500 cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-700 cursor-pointer"
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
                  className="w-full h-10 bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-center text-xs text-gray-600 mt-2">
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
        </section>
      </main>

      <FooterStart />
    </div>
  );
}
