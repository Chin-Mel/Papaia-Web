import "./ForgotPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/login-backgroundpic.jpg';
import logo from '../../assets/papaia-logo.png';
import mailIcon from '../../assets/mail.png';

function ForgotPassword() {
  return (
    <>
      <HeaderStart />

      <div className="forgotpassword-page-container">
        {/* Left: Image */}
        <div className="side-container">
          <img src={sidePic} alt="Papaia Side Picture" className="sidepic" />
        </div>

        {/* Right: Forgot Password Form */}
        <div className="side-forgotpassword">
          <div className="logo-container-forgotpassword">
            <img src={logo} alt="papaia-logo" className="logo-forgotpassword" />
            <h3>Forgot Password</h3>

            <h4>Email Address</h4>
            <div className="input-wrapper">
              <img src={mailIcon} alt="Mail Icon" className="input-icon" />
              <input type="text" placeholder="Enter Email" className="email-input" />
            </div>

            <button className="sendcode-button">Send OTP</button>
          </div>
        </div>
      </div>

      <FooterMain />
    </>
  );
}

export default ForgotPassword;
