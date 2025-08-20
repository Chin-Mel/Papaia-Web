import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderStart from "../components/Header/HeaderStart";
import Footer from "../components/Footer/FooterMain";
import BackgroundImage from "../assets/hero-background.png";
import PapayaLogo from "../assets/papaia-logo.png";

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare userData
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: "owner",
      middleName: formData.middleName || undefined,
      lastName: formData.lastName,
      suffix: formData.suffix || undefined,
      birthDate: formData.dateOfBirth, // we'll convert next
      contactNumber: formData.phoneNumber,
      profilePicture: undefined,
      street: undefined,
      barangay: undefined,
      municipality: undefined,
      province: undefined,
      zipCode: undefined,
    };

    // ✅ Convert YYYY-MM-DD → MM-DD-YYYY
    if (userData.birthDate) {
      const [year, month, day] = userData.birthDate.split("-");
      userData.birthDate = `${month}-${day}-${year}`;
    }

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          data.message ||
            "Account created successfully. Please check your email."
        );
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
                    placeholder="Enter last name"
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
                    placeholder="Enter first name"
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
                    placeholder="Enter middle name"
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
                    onChange={(e) =>
                      handleInputChange("suffix", e.target.value)
                    }
                    value={formData.suffix}
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
                    Date of Birth (Must be 18+)
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00712D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="dateOfBirth"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    max={(() => {
                      const today = new Date();
                      const maxDate = new Date(
                        today.getFullYear() - 18,
                        today.getMonth(),
                        today.getDate()
                      );
                      return maxDate.toISOString().split("T")[0];
                    })()}
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      const age =
                        today.getFullYear() - selectedDate.getFullYear();
                      const monthDiff =
                        today.getMonth() - selectedDate.getMonth();

                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          today.getDate() < selectedDate.getDate())
                      ) {
                        // If birthday hasn't occurred this year, subtract 1 from age
                        if (age - 1 < 18) {
                          alert(
                            "You must be at least 18 years old to use this website."
                          );
                          return;
                        }
                      } else if (age < 18) {
                        alert(
                          "You must be at least 18 years old to use this website."
                        );
                        return;
                      }

                      handleInputChange("dateOfBirth", e.target.value);
                    }}
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
                    placeholder="Choose username"
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
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
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
                    type="tel"
                    placeholder="Enter phone number"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
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
