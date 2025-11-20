import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import { ChevronDown } from "lucide-react";

import MainBackground from "../assets/MainBackground.jpg";
import PapayaLogo from "../assets/papaia-logo.png";
import UserIcon from "../assets/user-icon.png";
import CreateUserIcon from "../assets/create-user.png";
import TagIcon from "../assets/tag-icon.png";
import MailIcon from "../assets/mail-icon.png";
import AtsignIcon from "../assets/atsign-icon.png";
import LockIcon from "../assets/lock-icon.png";
import EyeIcon from "../assets/eye-icon.png";
import EyeOffIcon from "../assets/eye-off-icon.png";
import CalendarIcon from "../assets/calendar-icon.png";
import PhoneIcon from "../assets/phone-icon.png";

function SuffixDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = useMemo(() => ["", "Jr.", "Sr.", "II", "III"], []);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[120px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-3 border border-gray-300 rounded-lg flex justify-between items-center text-sm bg-white hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Select suffix"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-3 py-2.5 cursor-pointer hover:bg-green-700 hover:text-white text-sm transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              {option || "None"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SignUpPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [suffix, setSuffix] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({
    lastName: "",
    firstName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Preload all images on mount
  useEffect(() => {
    const images = [
      MainBackground,
      PapayaLogo,
      UserIcon,
      CreateUserIcon,
      TagIcon,
      MailIcon,
      AtsignIcon,
      LockIcon,
      EyeIcon,
      EyeOffIcon,
      CalendarIcon,
      PhoneIcon,
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Memoize max date calculation
  const maxDate = useMemo(() => {
    return new Date(
      new Date().getFullYear() - 18,
      new Date().getMonth(),
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0];
  }, []);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Input classes function
  const inputClasses = (hasError) => `
    w-full h-9 px-3 text-sm 
    bg-white border rounded-lg 
    transition-all duration-200
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
    hover:border-gray-400
    ${
      hasError
        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
        : "border-gray-300"
    }
  `;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (confirmPassword && confirmPassword !== value) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password && password !== value) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

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
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const errors = {};

    const lastNameVal = lastName.trim();
    const firstNameVal = firstName.trim();
    const middleNameVal = middleName.trim();
    const usernameVal = username.trim();
    const emailVal = email.trim();
    const phoneNumberVal = phoneNumber.trim();
    const pwd = password.trim();
    const confirmPwd = confirmPassword.trim();

    if (!lastNameVal) errors.lastName = "Last name is required";
    if (!firstNameVal) errors.firstName = "First name is required";
    if (!usernameVal) errors.username = "Username is required";
    if (!emailVal) errors.email = "Email is required";
    else if (!validateEmail(emailVal)) errors.email = "Invalid email format";
    if (!phoneNumberVal) errors.phoneNumber = "Phone number is required";
    if (!pwd) errors.password = "Password is required";
    if (!confirmPwd) errors.confirmPassword = "Confirm your password";
    else if (pwd !== confirmPwd)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the errors above.");
      setIsLoading(false);
      return;
    }

    if (!isChecked) {
      setError("You must agree to the terms first.");
      setIsLoading(false);
      return;
    }

    let formattedBirthDate = "";
    if (dob) {
      try {
        const dateParts = dob.split("-");
        if (dateParts.length === 3) {
          const [year, month, day] = dateParts;
          formattedBirthDate = `${month}-${day}-${year}`;
        } else {
          throw new Error("Invalid date format");
        }
      } catch (dateError) {
        setError("Invalid date format. Please select a valid date.");
        setIsLoading(false);
        return;
      }
    }

    const userData = {
      username: usernameVal,
      email: emailVal,
      password: pwd,
      role: "owner",
      firstName: firstNameVal,
      middleName: middleNameVal || "",
      lastName: lastNameVal,
      suffix: suffix || "",
      birthDate: formattedBirthDate || null,
      contactNumber: phoneNumberVal,
      profilePicture: "",
      street: "",
      barangay: "",
      municipality: "",
      province: "",
      zipCode: "",
    };

    try {
      const result = await registerUser(userData);

      setError("");

      const successMessage =
        result.message ||
        "Account created successfully! Please check your email to verify your account.";
      alert(successMessage);

      window.location.href = "/sign-in";
    } catch (error) {
      if (
        error.message.includes("Email already exists") ||
        error.message.includes("Username already exists")
      ) {
        setError(error.message);
      } else if (error.message.includes("Server error")) {
        setError(
          "The server is experiencing issues. Please try again in a few minutes."
        );
      } else if (error.message.includes("Network error")) {
        setError(
          "Connection problem. Please check your internet and try again."
        );
      } else if (error.message.includes("provide all required fields")) {
        setError("Please fill in all required fields.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      if (!value) setError("Email is required");
      else if (!validateEmail(value)) setError("Wrong email format");
      else setError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1 relative flex justify-center py-16 px-4 overflow-hidden">
        {/* Fixed background */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${MainBackground})`,
            backgroundAttachment: "fixed",
          }}
        />

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl relative z-10 my-8"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center py-6 px-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                <img
                  src={PapayaLogo}
                  alt="Papaia Logo"
                  className="w-10 h-10"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">Sign Up</h1>
              <p className="text-[#FDEDD3] text-sm mt-1 text-center">
                Create your farm dashboard account
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <ChevronDown className="w-4 h-4 text-[#00712D]" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={UserIcon}
                        alt="User"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      className={inputClasses(formErrors.lastName)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={UserIcon}
                        alt="User"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      className={inputClasses(formErrors.firstName)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={UserIcon}
                        alt="User"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Enter middle name"
                      autoComplete="middle-name"
                      className={inputClasses(false)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={TagIcon}
                        alt="Tag"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Suffix
                    </label>
                    <SuffixDropdown value={suffix} onChange={setSuffix} />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={CalendarIcon}
                        alt="Calendar"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={maxDate}
                      className={inputClasses(false)}
                    />
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <ChevronDown className="w-4 h-4 text-[#00712D]" />
                  Account Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={AtsignIcon}
                        alt="Username"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose username"
                      autoComplete="username"
                      className={inputClasses(formErrors.username)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={MailIcon}
                        alt="Mail"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Enter email address"
                      autoComplete="email"
                      className={inputClasses(formErrors.email)}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={PhoneIcon}
                        alt="Phone"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      className={inputClasses(formErrors.phoneNumber)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={LockIcon}
                        alt="Lock"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        autoComplete="new-password"
                        onChange={handlePasswordChange}
                        className={inputClasses(formErrors.password) + " pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <img
                          src={showPassword ? EyeOffIcon : EyeIcon}
                          alt={showPassword ? "Hide" : "Show"}
                          className="w-4 h-4"
                          loading="eager"
                          decoding="async"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                      <img
                        src={LockIcon}
                        alt="Lock"
                        className="w-3.5 h-3.5 opacity-70"
                        loading="eager"
                        decoding="async"
                      />
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={handleConfirmPasswordChange}
                        className={
                          inputClasses(
                            formErrors.confirmPassword || confirmPasswordError
                          ) + " pr-10"
                        }
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
                          alt={showConfirmPassword ? "Hide" : "Show"}
                          className="w-4 h-4"
                          loading="eager"
                          decoding="async"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-orange-500 cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-orange-500 hover:text-orange-600 font-medium hover:underline underline-offset-2 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-500 hover:text-orange-600 font-medium hover:underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isChecked || isLoading}
                className={`
                  w-full h-11 
                  bg-gradient-to-r from-[#00712D] to-[#F97316]
                  text-base font-semibold text-white 
                  rounded-lg shadow-lg 
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  ${
                    !isChecked || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                  }
                `}
              >
                <img
                  src={CreateUserIcon}
                  alt="Create"
                  className="w-5 h-5"
                  loading="eager"
                  decoding="async"
                />
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Error Message */}
              {(error ||
                confirmPasswordError ||
                Object.values(formErrors).find((err) => err)) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center font-medium">
                    {error ||
                      confirmPasswordError ||
                      "Please fill in all required fields."}
                  </p>
                </div>
              )}

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-500 hover:text-orange-600 font-semibold hover:underline underline-offset-2 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </main>

      <FooterStart />
    </div>
  );
}
