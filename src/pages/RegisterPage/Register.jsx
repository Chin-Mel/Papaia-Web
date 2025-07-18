import "./Register.css";
import HeaderStart from "../../components/Header/HeaderStart";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import userIcon from "../../assets/user.png";
import emailIcon from "../../assets/mail.png";
import phoneIcon from "../../assets/call.png";
import dobIcon from "../../assets/calendar.png";
import lockIcon from "../../assets/password.png";
import locationIcon from "../../assets/location.png";

function Register() {
  const navigate = useNavigate();
  function getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); // Subtract 18 years
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Simple email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    const phoneRegex = /^9\d{9}$/;

    if (!phoneRegex.test(value)) {
      setPhoneError("Phone number must start with 9 and be 10 digits long.");
    } else {
      setPhoneError("");
    }
  };
  const finalPhoneNumber = "0" + phone;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }

    // Also validate confirm password on password change
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
      email: email,
      username: form.username.value,
      password: password,
      role: "farmer",
      firstName: form.firstName.value,
      middleName: form.middleName.value || "",
      lastName: form.lastName.value,
      suffix: form.suffix.value || "",
      dob: form.dob.value,
      phone: finalPhoneNumber,
      street: form.street.value,
      barangay: form.barangay.value,
      municipality: form.municipality.value,
      province: form.province.value,
      zipCode: form.zipcode.value,
      profilePicture: "",
    };

    // ✅ Validation check
    let hasError = false;
    if (!email || emailError) hasError = true;
    if (!phone || phoneError) hasError = true;
    if (!phone || phoneError) hasError = true;
    if (!form.zipcode.value || !/^\d{4}$/.test(form.zipcode.value))
      hasError = true;
    if (!password || passwordError) hasError = true;
    if (!confirmPassword || confirmPasswordError) hasError = true;

    if (hasError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await fetch("https://papaiaapi.onrender.com/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      } else {
        alert(result.message || "Registration failed. Please try again.");
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
                {/* Name Fields */}
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
                      type="text"
                      placeholder="Enter Suffix Jr., III..."
                    />
                  </div>
                </div>

                {/* Username & Email */}
                <div className="register-input-wrapper register-full">
                  <label htmlFor="username">Username</label>
                  <img
                    src={userIcon}
                    alt="User Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="username"
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

                {/* Phone & DOB */}
                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <label htmlFor="phone">Phone Number</label>
                    <img
                      src={phoneIcon}
                      alt="Phone Icon"
                      className="register-input-icon"
                    />
                    <input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="9XXXXXXXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                  <div className="register-input-wrapper">
                    <label htmlFor="dob">Date of Birth</label>
                    <img
                      src={dobIcon}
                      alt="Calendar Icon"
                      className="register-input-icon"
                    />
                    <input type="date" name="dob" max={getMaxDate()} required />
                  </div>
                </div>
                {phoneError && (
                  <span className="error-message">{phoneError}</span>
                )}

                {/* Address Fields */}
                <div className="register-input-wrapper register-full">
                  <label htmlFor="street">Street</label>
                  <img
                    src={locationIcon}
                    alt="Location Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="street"
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
                      type="text"
                      placeholder="Enter Zip Code"
                      pattern="^\d{4}$"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="register-input-wrapper register-full">
                  <label htmlFor="password">Create Password</label>
                  <img
                    src={lockIcon}
                    alt="Lock Icon"
                    className="register-input-icon"
                  />
                  <input
                    id="password"
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={passwordError ? "input-error" : ""}
                  />
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
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className={confirmPasswordError ? "input-error" : ""}
                  />
                </div>
                {confirmPasswordError && (
                  <span className="error-message">{confirmPasswordError}</span>
                )}

                {/* Submit Button */}
                <button type="submit" className="register-submit-button">
                  Register
                </button>

                {/* Link to Login */}
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
