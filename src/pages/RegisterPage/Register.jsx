import "./Register.css";
import HeaderStart from "../../components/Header/HeaderStart";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/password.png";
import locationIcon from "../../assets/location.png";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      emailRegex.test(value) ? "" : "Please enter a valid email address."
    );
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      value.length < 8 ? "Password must be at least 8 characters." : ""
    );
    setConfirmPasswordError(
      confirmPassword && value !== confirmPassword
        ? "Passwords do not match."
        : ""
    );
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(
      value !== password ? "Passwords do not match." : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      username: form.username.value,
      email: email,
      password: password,
      role: "owner",
      firstName: form.firstName.value,
      middleName: form.middleName.value || "",
      lastName: form.lastName.value,
      suffix: form.suffix.value || "",
      street: form.street.value,
      barangay: form.barangay.value,
      municipality: form.municipality.value,
      province: form.province.value,
      zipCode: form.zipcode.value,
    };

    let hasError = false;
    if (!email || emailError) hasError = true;
    if (!form.zipcode.value || !/^\d{4}$/.test(form.zipcode.value))
      hasError = true;
    if (!password || passwordError) hasError = true;
    if (!confirmPassword || confirmPasswordError) hasError = true;

    if (hasError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      console.log("Submitting formData:", formData); // ✅ Log what you're sending

      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text(); // ← works even if it's not valid JSON
      console.log("Raw backend response:", responseText);

      if (response.ok) {
        alert(
          "Registration successful! Please check your email to verify your account."
        );
        navigate("/login");
      } else {
        alert("Registration failed. Check console for backend error.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <HeaderStart />
      <main className="register-content-wrapper">
        <div className="register-page-container">
          <div className="register-side-container">
            <img
              src={sidePic}
              alt="Papaia Background"
              className="register-sidepic"
            />
          </div>
          <div className="register-side-form">
            <div className="register-form-container">
              <img src={logo} alt="Papaia Logo" className="register-logo" />
              <h2 className="register-heading">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <label htmlFor="lastName">Last Name</label>
                    <img
                      src={userIcon}
                      alt="User Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter Last Name"
                      required
                    />
                  </div>
                  <div className="register-input-wrapper">
                    <label htmlFor="firstName">First Name</label>
                    <img
                      src={userIcon}
                      alt="User Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter First Name"
                      required
                    />
                  </div>
                </div>

                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <label htmlFor="middleName">Middle Name</label>
                    <img
                      src={userIcon}
                      alt="User Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      placeholder="Enter Middle Name"
                    />
                  </div>
                  <div className="register-input-wrapper">
                    <label htmlFor="suffix">Suffix</label>
                    <img
                      src={userIcon}
                      alt="User Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="suffix"
                      name="suffix"
                      type="text"
                      placeholder="Enter Suffix Jr., III..."
                    />
                  </div>
                </div>

                <div className="register-input-wrapper register-full">
                  <label htmlFor="username">Username</label>
                  <img
                    src={userIcon}
                    alt="User Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                    required
                  />
                </div>

                <div className="register-input-wrapper register-full">
                  <label htmlFor="email">Email Address</label>
                  <img
                    src={emailIcon}
                    alt="Email Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email Address"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                {emailError && (
                  <span className="error-message">{emailError}</span>
                )}

                <div className="register-input-wrapper register-full">
                  <label htmlFor="street">Street</label>
                  <img
                    src={locationIcon}
                    alt="Location Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="Enter Street"
                    required
                  />
                </div>

                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <label htmlFor="barangay">Barangay</label>
                    <img
                      src={locationIcon}
                      alt="Location Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="barangay"
                      name="barangay"
                      type="text"
                      placeholder="Enter Barangay"
                      required
                    />
                  </div>
                  <div className="register-input-wrapper">
                    <label htmlFor="municipality">Municipality</label>
                    <img
                      src={locationIcon}
                      alt="Location Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="municipality"
                      name="municipality"
                      type="text"
                      placeholder="Enter Municipality"
                      required
                    />
                  </div>
                </div>

                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <label htmlFor="province">Province</label>
                    <img
                      src={locationIcon}
                      alt="Location Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="province"
                      name="province"
                      type="text"
                      placeholder="Enter Province"
                      required
                    />
                  </div>
                  <div className="register-input-wrapper">
                    <label htmlFor="zipcode">Zip Code</label>
                    <img
                      src={locationIcon}
                      alt="Location Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="zipcode"
                      name="zipcode"
                      type="text"
                      placeholder="Enter Zip Code"
                      pattern="^\d{4}$"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <div className="register-input-wrapper register-full">
                  <label htmlFor="password">Create Password</label>
                  <img
                    src={lockIcon}
                    alt="Lock Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={passwordError ? "input-error" : ""}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {passwordError && (
                  <span className="error-message">{passwordError}</span>
                )}

                <div className="register-input-wrapper register-full">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <img
                    src={lockIcon}
                    alt="Lock Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className={confirmPasswordError ? "input-error" : ""}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
                {confirmPasswordError && (
                  <span className="error-message">{confirmPasswordError}</span>
                )}

                <button type="submit" className="register-submit-button">
                  Register
                </button>
                <p className="register-login-link">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
