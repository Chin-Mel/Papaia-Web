import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import { ChevronDown } from "lucide-react";

import BackgroundImage from "../assets/hero-background.png";
import PapayaLogo from "../assets/papaia-logo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons
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
  const options = ["", "Jr.", "Sr.", "II", "III"];
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    <div className="relative min-w-[120px] sm:min-w-[140px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-3 sm:px-4 border border-gray-300 rounded-lg flex justify-between items-center text-sm sm:text-base bg-white hover:bg-gray-100 transition-all duration-150 active:scale-95 cursor-pointer"
      >
        {value || "Select suffix"}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-green-700 hover:text-white text-sm sm:text-base"
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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [suffix, setSuffix] = useState("");
  const [dob, setDob] = useState(null);
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

  // Helper: validate email
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Update password and confirm password
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

  // API registration function
  const registerUser = async (userData) => {
    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const errors = {};

    const lastName = e.target.lastName.value.trim();
    const firstName = e.target.firstName.value.trim();
    const middleName = e.target.middleName.value.trim();
    const username = e.target.username.value.trim();
    const emailVal = e.target.email.value.trim();
    const phoneNumber = e.target.phoneNumber.value.trim();
    const pwd = password.trim();
    const confirmPwd = confirmPassword.trim();

    // Validation
    if (!lastName) errors.lastName = "Last name is required";
    if (!firstName) errors.firstName = "First name is required";
    if (!username) errors.username = "Username is required";
    if (!emailVal) errors.email = "Email is required";
    else if (!validateEmail(emailVal)) errors.email = "Invalid email format";
    if (!phoneNumber) errors.phoneNumber = "Phone number is required";
    if (!pwd) errors.password = "Password is required";
    if (!confirmPwd) errors.confirmPassword = "Confirm your password";
    else if (pwd !== confirmPwd)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);

    // If all required fields are empty
    const requiredFields = [
      lastName,
      firstName,
      username,
      emailVal,
      phoneNumber,
      pwd,
      confirmPwd,
    ];
    const allEmpty = requiredFields.every((f) => f === "");

    if (allEmpty) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    } else {
      setError(""); // clear previous error
    }

    // Prevent submit if there are errors
    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      return;
    }

    if (!isChecked) {
      setError("You must agree to the terms first.");
      setIsLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      username,
      email: emailVal,
      password: pwd,
      role: "owner", // Default role as per API documentation
      firstName,
      lastName,
      contactNumber: phoneNumber,
      profilePicture: "https://example.com/avatar.png", // Default profile picture
    };

    // Add optional fields only if they have values
    if (middleName) userData.middleName = middleName;
    if (suffix) userData.suffix = suffix;
    if (dob) {
      // Format date as MM-DD-YYYY as required by API
      const month = String(dob.getMonth() + 1).padStart(2, "0");
      const day = String(dob.getDate()).padStart(2, "0");
      const year = dob.getFullYear();
      userData.birthDate = `${month}-${day}-${year}`;
    }

    try {
      const result = await registerUser(userData);

      // Success - show success message
      if (result.success || result.message) {
        setError("");
        alert(
          result.message ||
            "Account created successfully! Please check your email to verify your account."
        );
        window.location.href = "/sign-in";
      }
    } catch (error) {
      // Handle different types of errors
      if (
        error.message.includes("Email already exists") ||
        error.message.includes("Username already exists")
      ) {
        setError(error.message);
      } else if (error.message.includes("provide all required fields")) {
        setError("Please fill in all required fields.");
      } else if (error.message.includes("verification email")) {
        setError(
          "Account created but failed to send verification email. Please contact support."
        );
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }

      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);

      // Live email validation
      if (!value) setError("Email is required");
      else if (!validateEmail(value)) setError("Wrong email format");
      else setError(""); // clear error if valid
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderStart />

      <main className="flex-1 relative flex justify-center pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-auto">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BackgroundImage})` }}
        />

        {/* Centered Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative z-10 w-full max-w-[1200px] min-w-[600px] sm:min-w-[700px] md:min-w-[900px] mx-4 sm:mx-6 my-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Gradient Header */}
              <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <img
                    src={PapayaLogo}
                    alt="Papaia Logo"
                    className="w-12 h-12"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mt-2">Sign Up</h1>
                <p className="text-[#FDEDD3] text-sm mt-1">
                  Create your farm dashboard account
                </p>
              </div>

              {/* Form */}
              <div className="p-6 sm:p-8 space-y-5">
                {/* Row 1: Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={UserIcon} alt="User" className="w-4 h-4" />
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      autoComplete="family-name"
                      className={`w-full h-12 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={UserIcon} alt="User" className="w-4 h-4" />
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      autoComplete="given-name"
                      className={`w-full h-12 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={UserIcon} alt="User" className="w-4 h-4" />
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      placeholder="Enter middle name"
                      autoComplete="middle-name"
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={TagIcon} alt="Tag" className="w-4 h-4" />
                      Suffix
                    </label>

                    <SuffixDropdown value={suffix} onChange={setSuffix} />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img
                        src={CalendarIcon}
                        alt="Calendar"
                        className="w-4 h-4"
                      />
                      Date of Birth
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={dob}
                        onChange={(date) => setDob(date)}
                        placeholderText="MM/DD/YYYY"
                        dateFormat="MM/dd/yyyy" // format
                        maxDate={
                          new Date(
                            new Date().getFullYear() - 18,
                            new Date().getMonth(),
                            new Date().getDate()
                          )
                        } // only allow 18+
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                        popperPlacement="bottom-start"
                        popperModifiers={[
                          {
                            name: "offset",
                            options: { offset: [0, 5] },
                          },
                          {
                            name: "preventOverflow",
                            options: { boundary: document.body },
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Username, Email, Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={AtsignIcon} alt="User" className="w-4 h-4" />
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose username"
                      autoComplete="username"
                      className={`w-full h-12 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.username
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={MailIcon} alt="Mail" className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Enter email address"
                      autoComplete="email"
                      className={`w-full h-12 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={PhoneIcon} alt="Phone" className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      className={`w-full h-12 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                        formErrors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={LockIcon} alt="Lock" className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        autoComplete="password"
                        onChange={handlePasswordChange}
                        className={`w-full h-12 px-4 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        <img
                          src={showPassword ? EyeOffIcon : EyeIcon}
                          alt={showPassword ? "Hide Password" : "Show Password"}
                          className="w-5 h-4"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                      <img src={LockIcon} alt="Lock" className="w-4 h-4" />
                      Confirm Password
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
                        className={`w-full h-12 px-4 pr-12 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none ${
                          formErrors.confirmPassword || confirmPasswordError
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        <img
                          src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                          alt={
                            showConfirmPassword
                              ? "Hide Password"
                              : "Show Password"
                          }
                          className="w-5 h-4"
                        />
                      </button>
                    </div>
                  </div>
                  <div></div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-4 h-4 border border-gray-400 rounded-sm accent-orange-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-orange-500 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-orange-500 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isChecked || isLoading}
                  className={`transition-all duration-150 active:scale-95 active:shadow-inner cursor-pointer w-full mt-4 h-14 bg-gradient-to-r bg-[#F97316] text-lg font-semibold text-white rounded-lg shadow-lg flex items-center justify-center gap-2
                    ${
                      !isChecked || isLoading
                        ? "opacity-50 cursor-not-allowed hover:bg-[#F97316]"
                        : "hover:bg-orange-600"
                    }`}
                >
                  <img
                    src={CreateUserIcon}
                    alt="Create Account"
                    className="w-5 h-5"
                  />
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="min-h-[20px] mt-3 text-center text-red-500 text-sm">
                  {error
                    ? error
                    : confirmPasswordError
                    ? confirmPasswordError
                    : Object.values(formErrors).find((err) => err)
                    ? "Please fill in all required fields."
                    : null}
                </div>

                {/* Sign In */}
                <p className="text-center mt-4 text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    className="text-orange-500 hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      <FooterStart />
    </div>
  );
}
