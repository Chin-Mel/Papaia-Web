import "./Verification.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from "../../assets/sidepic.jpg";
import logo from "../../assets/papaia-logo.png";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Verification() {
  const otp1Ref = useRef(null);
  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resending, setResending] = useState(false);

  const handleChange = (e, nextRef) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      e.target.value = value;
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, currentRef, prevRef) => {
    if (
      e.key === "Backspace" &&
      !currentRef.current.value &&
      prevRef?.current
    ) {
      prevRef.current.focus();
    }
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleVerify = async () => {
    const otp = `${otp1Ref.current.value}${otp2Ref.current.value}${otp3Ref.current.value}${otp4Ref.current.value}`;

    if (otp.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    if (!email) {
      setError("Invalid or expired OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/new-password", { state: { userId: data.userId } });
      } else {
        setError(data.message || "Invalid or expired OTP.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (resendDisabled) return;

    try {
      setError("");
      setMessage("");
      setResending(true);
      setResendDisabled(true);
      setResendCountdown(30);

      const response = await fetch(
        "https://papaiaapi.onrender.com/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("A new OTP has been sent to your email.");
      } else {
        setError(data.message || "Unable to resend OTP.");
      }
    } catch (err) {
      setError("Something went wrong while resending OTP.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  return (
    <>
      <HeaderStart />

      <main className="verification-content-wrapper">
        <div className="verification-page-container">
          <div className="verification-side-container">
            <img
              src={sidePic}
              alt="Papaia Side Picture"
              className="verification-sidepic"
            />
          </div>

          <div className="verification-side-form">
            <div className="verification-form-container">
              <img src={logo} alt="papaia-logo" className="verification-logo" />
              <h3 className="verification-heading">Verification</h3>

              <h4 className="verification-label">Enter Verification Code</h4>
              <div className="verification-input-wrapper">
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength="1"
                  ref={otp1Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp2Ref)}
                  onKeyDown={(e) => handleKeyDown(e, otp1Ref, null)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength="1"
                  ref={otp2Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp3Ref)}
                  onKeyDown={(e) => handleKeyDown(e, otp2Ref, otp1Ref)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength="1"
                  ref={otp3Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp4Ref)}
                  onKeyDown={(e) => handleKeyDown(e, otp3Ref, otp2Ref)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength="1"
                  ref={otp4Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, null)}
                  onKeyDown={(e) => handleKeyDown(e, otp4Ref, otp3Ref)}
                />
              </div>

              {error && (
                <p className="verification-error" style={{ color: "red" }}>
                  {error}
                </p>
              )}
              {message && (
                <p className="verification-success" style={{ color: "green" }}>
                  {message}
                </p>
              )}

              <p className="verification-resend-text">
                Didn’t receive a code?{" "}
                <a
                  href="#"
                  onClick={handleResend}
                  className="verification-resend-link"
                  style={{
                    color: resendDisabled ? "gray" : "green",
                    pointerEvents: resendDisabled ? "none" : "auto",
                    textDecoration: "underline",
                    cursor: resendDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {resending
                    ? "Resending..."
                    : resendDisabled
                    ? `Resend in ${resendCountdown}s`
                    : "Resend"}
                </a>
              </p>

              <button
                onClick={handleVerify}
                className="verification-submit-button"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Verification;
