import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderStart from "../components/Header/HeaderStart";
import Footer from "../components/Footer/FooterMain";
import BackgroundImage from "../assets/hero-background.png";
import PapayaLogo from "../assets/papaia-logo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import all your icons from the assets folder
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

export default function SignUp() {
  const navigate = useNavigate();
  const requiredFields = [
    "firstName",
    "lastName",
    "username",
    "email",
    "password",
    "confirmPassword",
  ];

  // Define formData state
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    dateOfBirth: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    confirmPassword: "",
  });

  // Show/hide password state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState({
    confirmPassword: false,
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email format",
      }));
    }

    // Confirm password validation (only if user touched it)
    if (field === "confirmPassword") {
      setTouched((prev) => ({ ...prev, confirmPassword: true }));
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match",
      }));
    }

    // Update confirm password error if password changes
    if (field === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.confirmPassword ? "" : "Passwords do not match",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingRequired = requiredFields.some((field) => !formData[field]);
    if (missingRequired) {
      alert("Please complete all required fields before registering.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: "owner",
      firstName: formData.firstName,
      middleName: formData.middleName && { middleName: formData.middleName },
      lastName: formData.lastName,
      suffix: formData.suffix && { suffix: formData.suffix },
      birthDate: formData.dateOfBirth
        ? (() => {
            const [year, month, day] = formData.dateOfBirth.split("-");
            return `${month}-${day}-${year}`; // MM-DD-YYYY
          })()
        : undefined,
      contactNumber: formData.phoneNumber && {
        contactNumber: formData.phoneNumber,
      },
      profilePicture: formData.profilePicture && {
        profilePicture: formData.profilePicture,
      },
      street: formData.street && { street: formData.street },
      barangay: formData.barangay && { barangay: formData.barangay },
      municipality: formData.municipality && {
        municipality: formData.municipality,
      },
      province: formData.province && { province: formData.province },
      zipCode: formData.zipCode && { zipCode: formData.zipCode },
    };

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Account created successfully.");
        navigate("/sign-in"); // go to sign-in page
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
        }}
      />

      {/* Header */}
      <HeaderStart />

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] p-8 text-center text-white">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-white rounded-full">
              <img src={PapayaLogo} alt="Papaia Logo" className="w-13 h-14" />
            </div>
            <h1 className="text-2xl font-bold font-poppins mb-2">
              Papaya Farm
            </h1>
            <p className="text-white/80 text-sm">
              Welcome back to your farm dashboard
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1: Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={UserIcon} alt="User" className="w-3 h-3" />
                    Last Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={UserIcon} alt="User" className="w-3 h-3" />
                    First Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                {/* Middle Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="middleName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={UserIcon} alt="User" className="w-3 h-3" />
                    Middle Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Enter middle name"
                    autoComplete="additional-name"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                  />
                </div>
                {/* Suffix */}
                <div className="space-y-2">
                  <label
                    htmlFor="suffix"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={TagIcon} alt="Tag" className="w-3 h-3" />
                    Suffix
                  </label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00712D] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="suffix"
                    name="suffix"
                    value={formData.suffix}
                    onChange={(e) =>
                      handleInputChange("suffix", e.target.value)
                    }
                  >
                    <option value="">Select suffix</option>
                    <option value="jr">Jr.</option>
                    <option value="sr">Sr.</option>
                    <option value="ii">II</option>
                    <option value="iii">III</option>
                  </select>
                </div>
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img
                      src={CalendarIcon}
                      alt="Calendar"
                      className="w-3 h-3"
                    />
                    Date of Birth
                  </label>
                  <DatePicker
                    selected={
                      formData.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                        : null
                    }
                    onChange={(date) => {
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      handleInputChange("dateOfBirth", `${yyyy}-${mm}-${dd}`);
                    }}
                    dateFormat="MM-dd-yyyy"
                    placeholderText="MM-DD-YYYY"
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Row 2: User, Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={AtsignIcon} alt="User" className="w-3 h-3" />
                    Username
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                </div>
                {/* Email Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={MailIcon} alt="Mail" className="w-3 h-3" />
                    Email Address
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={PhoneIcon} alt="Phone" className="w-3 h-3" />
                    Phone Number
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Row 3: Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={LockIcon} alt="Lock" className="w-3 h-3" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <img
                          src={EyeOffIcon}
                          alt="Hide Password"
                          className="w-4 h-3"
                        />
                      ) : (
                        <img
                          src={EyeIcon}
                          alt="Show Password"
                          className="w-4 h-3"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 text-gray-700 font-poppins"
                  >
                    <img src={LockIcon} alt="Lock" className="w-3 h-3" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <img
                          src={EyeOffIcon}
                          alt="Hide Password"
                          className="w-4 h-4"
                        />
                      ) : (
                        <img
                          src={EyeIcon}
                          alt="Show Password"
                          className="w-4 h-3"
                        />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                {/* Empty div to maintain grid alignment */}
                <div></div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className="peer h-4 w-4 shrink-0 rounded-sm border-2 border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#00712D] data-[state=checked]:text-white"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 font-poppins"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#FF8C42] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#FF8C42] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#FF8C42] to-[#F97316] px-6 py-3 font-poppins text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
                  disabled={!formData.agreeToTerms}
                >
                  <img
                    src={CreateUserIcon}
                    alt="Create Account"
                    className="w-7 h-5"
                  />
                  Create Account
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 font-poppins">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    className="text-[#FF8C42] hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Renders the imported Footer component */}
      <Footer />
    </div>
  );
}
