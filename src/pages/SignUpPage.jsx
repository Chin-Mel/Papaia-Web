import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

// Mock components for demonstration
const HeaderStart = () => <div className="bg-white shadow-sm h-16" />;
const FooterStart = () => (
  <div className="bg-gray-900 text-white p-4 text-center text-sm">
    © 2024 Papaia
  </div>
);

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
    <div className="relative min-w-[120px] sm:min-w-[140px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 border border-gray-300 rounded-xl flex justify-between items-center text-sm sm:text-base bg-white hover:border-orange-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto backdrop-blur-sm">
          {options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="px-3 sm:px-4 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-green-700 hover:to-green-600 hover:text-white text-sm sm:text-base transition-all duration-150 first:rounded-t-xl last:rounded-b-xl"
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const errors = {};

    const lastNameVal = lastName.trim();
    const firstNameVal = firstName.trim();
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

    // Simulate API call
    setTimeout(() => {
      alert("Account created successfully! (Demo mode)");
      setIsLoading(false);
    }, 2000);
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

  const inputClasses = (hasError) => `
    w-full h-10 sm:h-11 lg:h-12 px-3 sm:px-4 text-sm sm:text-base 
    bg-white border rounded-xl 
    transition-all duration-200
    placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
    hover:border-orange-400
    ${
      hasError
        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
        : "border-gray-300"
    }
  `;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50">
      <HeaderStart />

      <main className="flex-1 relative flex justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-7xl relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Elegant Header */}
            <div className="relative bg-gradient-to-r from-[#00712D] to-[#F97316] px-6 py-8 sm:py-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

              <div className="relative flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/30 transform hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl"></div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-4 tracking-tight">
                  Create Account
                </h1>
                <p className="text-orange-100 text-sm sm:text-base lg:text-lg mt-2 text-center font-light">
                  Join us and start managing your farm dashboard
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-7 lg:space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#00712D] to-[#F97316] rounded-full"></div>
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Suffix
                    </label>
                    <SuffixDropdown value={suffix} onChange={setSuffix} />
                  </div>

                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
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

              {/* Account Information Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#00712D] to-[#F97316] rounded-full"></div>
                  Account Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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

                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
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
                </div>
              </div>

              {/* Security Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#00712D] to-[#F97316] rounded-full"></div>
                  Security
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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
                        className={inputClasses(formErrors.password) + " pr-12"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
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
                          ) + " pr-12"
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded-md accent-orange-500 cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-orange-500/20"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-orange-500 hover:text-orange-600 font-medium underline-offset-2 hover:underline transition-colors cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-orange-500 hover:text-orange-600 font-medium underline-offset-2 hover:underline transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isChecked || isLoading}
                className={`
                  w-full h-12 sm:h-13 lg:h-14 
                  bg-gradient-to-r from-[#00712D] to-[#F97316]
                  text-base sm:text-lg font-semibold text-white 
                  rounded-xl shadow-lg 
                  flex items-center justify-center gap-3
                  transition-all duration-300
                  ${
                    !isChecked || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {(error ||
                confirmPasswordError ||
                Object.values(formErrors).find((err) => err)) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
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
                <span className="text-orange-500 hover:text-orange-600 font-semibold underline-offset-2 hover:underline transition-colors cursor-pointer">
                  Sign in here
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterStart />
    </div>
  );
}
