import "./Verification.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from '../../assets/sidepic.jpg';
import logo from '../../assets/papaia-logo.png';
import { useRef } from "react";

function Verification() {
  const otp1Ref = useRef(null);
  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);

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

  return (
    <>
      <HeaderStart />

      <main className="verification-content-wrapper">
        <div className="verification-page-container">
          <div className="verification-side-container">
            <img src={sidePic} alt="Papaia Side Picture" className="verification-sidepic" />
          </div>

          <div className="verification-side-form">
            <div className="verification-form-container">
              <img src={logo} alt="papaia-logo" className="verification-logo" />
              <h3 className="verification-heading">Verification</h3>

              <h4 className="verification-label">Enter Verification Code</h4>
              <div className="verification-input-wrapper">
                <input
                  type="text"
                  maxLength="1"
                  ref={otp1Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp2Ref)}
                />
                <input
                  type="text"
                  maxLength="1"
                  ref={otp2Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp3Ref)}
                />
                <input
                  type="text"
                  maxLength="1"
                  ref={otp3Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, otp4Ref)}
                />
                <input
                  type="text"
                  maxLength="1"
                  ref={otp4Ref}
                  className="verification-otp-input"
                  onChange={(e) => handleChange(e, null)}
                />
              </div>

              <p className="verification-resend-text">
                Didn’t receive a code? <a href="#" className="verification-resend-link">Resend</a>
              </p>

              <button className="verification-submit-button">Verify OTP</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Verification;
