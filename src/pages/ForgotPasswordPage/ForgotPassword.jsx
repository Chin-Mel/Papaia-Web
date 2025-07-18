import "./ForgotPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import mailIcon from "../../assets/mail.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const navigate = useNavigate();

  const validateEmailFormat = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value.trim())) {
      setEmailFormatError("Please enter a valid email address.");
    } else {
      setEmailFormatError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || emailFormatError) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch(
        "https://papaiaapi.onrender.com/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ✅ Navigate to /verify-otp with email as state
        navigate("/verify-otp", { state: { email: email.trim() } });
      } else {
        setError(data.message || "Email not found or invalid.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Failed to connect to server.");
    }
  };

  return (
    <>
      <HeaderStart />

      <main className="forgotpassword-content-wrapper">
        <div className="forgotpassword-page-container">
          <div className="forgotpassword-side-container">
            <img
              src={sidePic}
              alt="Papaia Side Picture"
              className="forgotpassword-sidepic"
            />
          </div>

          <div className="forgotpassword-side-form">
            <div className="forgotpassword-form-container">
              <img
                src={logo}
                alt="papaia-logo"
                className="forgotpassword-logo"
              />
              <h2 className="forgotpassword-heading">Forgot Password</h2>

              <form onSubmit={handleSubmit}>
                <div className="forgotpassword-input-wrapper forgotpassword-full">
                  <img
                    src={mailIcon}
                    alt="Mail Icon"
                    className="forgotpassword-input-icon"
                  />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="forgotpassword-input"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmailFormat(e.target.value);
                    }}
                    required
                  />
                </div>

                {emailFormatError && (
                  <p className="error-text">{emailFormatError}</p>
                )}
                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="forgotpassword-submit-button">
                  Send OTP
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ForgotPassword;
