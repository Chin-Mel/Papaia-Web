import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import FooterStart from "../components/Footer/FooterStart";
import HeaderStart from "../components/Header/HeaderStart";
import {
  ChevronDown,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Tag,
  AtSign,
} from "lucide-react";

import MainBackground from "../assets/MainBackground.jpg";
import PapayaLogo from "../assets/papaia-logo.png";
import CreateUserIcon from "../assets/create-user.png";

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
        className="w-full h-10 px-4 border-2 border-gray-200 rounded-xl flex justify-between items-center text-sm bg-white/90 hover:bg-white hover:border-orange-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Select"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-4 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-green-600 hover:to-orange-500 hover:text-white text-sm transition-all duration-150 first:rounded-t-xl last:rounded-b-xl"
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

  useEffect(() => {
    const images = [MainBackground, PapayaLogo, CreateUserIcon];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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

  const inputClasses = (hasError) => `
    w-full h-10 pl-11 pr-4 text-sm 
    bg-white/90 border-2 rounded-xl 
    transition-all duration-200
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white
    hover:bg-white hover:border-orange-300
    ${
      hasError
        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
        : "border-gray-200"
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

      <main className="flex-1 relative flex justify-center py-12 px-4">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: `url(${MainBackground})`,
            backgroundAttachment: "fixed",
          }}
        />

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl relative z-10 my-6"
        >
          <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] py-6 px-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
                  <img
                    src={PapayaLogo}
                    alt="Papaia Logo"
                    className="w-10 h-10"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome!</h1>
                <p className="text-white/90 text-sm text-center max-w-md">
                  Create your farm dashboard account
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Column */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Personal Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Middle Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Suffix
                        </label>
                        <SuffixDropdown value={suffix} onChange={setSuffix} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                </div>

                {/* Account Information Column */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Account Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            autoComplete="new-password"
                            onChange={handlePasswordChange}
                            className={
                              inputClasses(formErrors.password) + " pr-12"
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Confirm Password{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                                formErrors.confirmPassword ||
                                  confirmPasswordError
                              ) + " pr-12"
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-green-50 to-orange-50 mb-5 rounded-2xl border-2 border-orange-200 mt-8">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded-lg accent-orange-500 cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline underline-offset-2 transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline underline-offset-2 transition-colors"
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
                  w-full h-12 
                  bg-gradient-to-r from-[#00712D] to-[#F97316]
                  text-base font-bold text-white 
                  rounded-xl shadow-lg 
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  ${
                    !isChecked || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                  <p className="text-sm text-red-700 text-center font-semibold">
                    {error ||
                      confirmPasswordError ||
                      "Please fill in all required fields."}
                  </p>
                </div>
              )}

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-orange-600 hover:text-orange-700 font-bold hover:underline underline-offset-2 transition-colors"
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
