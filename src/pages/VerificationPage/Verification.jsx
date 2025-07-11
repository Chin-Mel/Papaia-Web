import "./Verification.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/login-backgroundpic.jpg';
import logo from '../../assets/papaia-logo.png';

function Verification() {
  return (
    <>
      <HeaderStart />

      <div className="verification-page-container">
        {/* Left: Image */}
        <div className="side-container">
          <img src={sidePic} alt="Papaia Side Picture" className="sidepic" />
        </div>

        {/* Right: Forgot Password Form */}
        <div className="side-verification">
          <div className="logo-container-verification">
            <img src={logo} alt="papaia-logo" className="logo-verification" />
            <h3>Verification</h3>

            <h4>Enter Verification Code</h4>
            <div className="input-wrapper">
              <input type="text" className="otp1-input" />
              <input type="text" className="otp2-input" />
              <input type="text" className="otp3-input" />
              <input type="text" className="otp4-input" />
            </div>
            
            <p>Didn't receive a code?<a href="#" className="send-code">Resend</a></p>
            <button className="verifycode-button">Verify OTP</button>
          </div>
        </div>
      </div>

      <FooterMain />
    </>
  );
}

export default Verification;
