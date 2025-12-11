import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [showRoleModal, setShowRoleModal] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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

  useEffect(() => {
    if (touched.email && email.trim()) {
      if (!validateEmail(email.trim())) {
        showAlert("error", "Invalid email format.");
      }
    }

    if (
      touched.password &&
      touched.confirmPassword &&
      password.trim() &&
      confirmPassword.trim()
    ) {
      if (password.trim() !== confirmPassword.trim()) {
        showAlert("error", "Passwords do not match.");
      }
    }
  }, [
    email,
    password,
    confirmPassword,
    touched.email,
    touched.password,
    touched.confirmPassword,
  ]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhoneNumber = (value) =>
    /^[0-9]{10,11}$/.test(value.replace(/[\s-]/g, ""));

  const getBorderClass = (fieldName, value) => {
    if (touched[fieldName] && !value.trim()) {
      return "border-red-500 border-2";
    }
    return "border-gray-300 focus:border-orange-500 focus:border-2";
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleFieldChange = (fieldName, value, setter) => {
    setter(value);
    if (touched[fieldName]) {
      setTouched((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleModalAgree = () => {
    setIsChecked(true);
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
      if (error.message?.includes("fetch")) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (!validateEmail(emailVal)) {
      showAlert("error", "Invalid email format.");
      return;
    }

    if (!validatePhoneNumber(phoneNumberVal)) {
      showAlert("error", "Invalid phone number.");
      return;
    }

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

      navigate("/sign-in", {
        state: {
          message:
            "Account created successfully. Please check your email to verify your account.",
        },
      });
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

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}
      <UserRoleModal isOpen={showRoleModal} onSelect={handleRoleSelect} />

      <main className="flex-1 relative flex justify-center py-12 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 filter brightness-110"
          style={{
            backgroundImage: `url(${MainBackground})`,
          }}
        ></div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl relative z-10 my-12"
        >
          <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-0">
            <div className="bg-gradient-to-r from-[#00712D] to-[#F97316] py-6 px-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mb-3 ring-4 ring-white/30">
                  <img
                    src={papaiaLogo}
                    alt="Papaia Logo"
                    className="w-4 h-6 sm:w-5 sm:h-7 md:w-6 md:h-8"
                    loading="eager"
                  />
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome!</h1>
                <p className="text-white/90 text-sm text-center max-w-md">
                  Create your farm dashboard account
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <img
                      src={UserIcon}
                      className="w-4 h-4"
                      alt=""
                      loading="eager"
                    />
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
                    placeholder="First name"
                    autoComplete="given-name"
                    className={`w-full h-10 px-4 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
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
                    placeholder="Last name"
                    autoComplete="family-name"
                    className={`w-full h-10 px-4 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
          "lastName",
          lastName
        )}`}
                  />
                </div>

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
                    placeholder="Username"
                    autoComplete="username"
                    className={`w-full h-10 px-4 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
          "username",
          username
        )}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
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
                    placeholder="Email address"
                    autoComplete="email"
                    className={`w-full h-10 px-4 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
        "email",
        email
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
                    placeholder="Phone number"
                    autoComplete="tel"
                    className={`w-full h-10 px-4 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
        "phoneNumber",
        phoneNumber
      )}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                      placeholder="Password"
                      autoComplete="new-password"
                      className={`w-full h-10 px-4 pr-10 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
          "password",
          password
        )}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <img
                        src={showPassword ? EyeOffIcon : EyeIcon}
                        className="w-5 h-5"
                        alt=""
                        loading="eager"
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
                      className={`w-full h-10 px-4 pr-10 text-sm bg-gray-50 border rounded-lg transition-all placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500 ${getBorderClass(
          "confirmPassword",
          confirmPassword
        )}`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <img
                        src={showConfirmPassword ? EyeOffIcon : EyeIcon}
                        className="w-5 h-5"
                        alt=""
                        loading="eager"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 mt-7 bg-gradient-to-r from-green-50 to-orange-50 mb-5 rounded-2xl border-2 border-orange-200">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <p className="text-sm text-gray-700">
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
                </p>
              </div>

              <button
                type="submit"
                disabled={!isChecked || isLoading}
                className={`
                  w-full h-12
                  bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
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
                <img src={CreateUserIcon} alt="Create" className="w-5 h-5" />
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

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
