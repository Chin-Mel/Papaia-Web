import "./Register.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";

import sidePic from '../../assets/login-backgroundpic.jpg';
import logo from '../../assets/papaia-logo.png';
import userIcon from '../../assets/user.png';
import emailIcon from '../../assets/mail.png';
import phoneIcon from '../../assets/call.png';
import dobIcon from '../../assets/calendar.png';
import lockIcon from '../../assets/password.png';

function Register() {
  return (
    <>
      <HeaderStart />

      {/* Main Content: Split View */}
      <main className="register-content-wrapper">
        <div className="register-page-container">

          {/* Left Side: Static Image */}
          <div className="side-container">
            <img src={sidePic} alt="Papaia Background" className="sidepic" />
          </div>

          {/* Right Side: Form */}
          <div className="side-register">
            <div className="form-container">
              <img src={logo} alt="Papaia Logo" className="form-logo" />
              <h2>Register</h2>

              {/* Name Fields */}
              <div className="double-row">
                <div className="input-wrapper">
                  <img src={userIcon} alt="User Icon" className="input-icon" />
                  <input type="text" placeholder="Enter Last Name" />
                </div>
                <div className="input-wrapper">
                  <img src={userIcon} alt="User Icon" className="input-icon" />
                  <input type="text" placeholder="Enter First Name" />
                </div>
              </div>

              <div className="double-row">
                <div className="input-wrapper">
                  <img src={userIcon} alt="User Icon" className="input-icon" />
                  <input type="text" placeholder="Enter Middle Name" />
                </div>
                <div className="input-wrapper">
                  <img src={userIcon} alt="User Icon" className="input-icon" />
                  <input type="text" placeholder="Enter Suffix Jr., III..." />
                </div>
              </div>

              {/* Username */}
              <div className="input-wrapper full">
                <img src={userIcon} alt="User Icon" className="input-icon" />
                <input type="text" placeholder="Enter Username" />
              </div>

              {/* Email */}
              <div className="input-wrapper full">
                <img src={emailIcon} alt="Email Icon" className="input-icon" />
                <input type="email" placeholder="Enter Email Address" />
              </div>

              {/* Phone & DOB */}
              <div className="double-row">
                <div className="input-wrapper">
                  <img src={phoneIcon} alt="Phone Icon" className="input-icon" />
                  <input type="tel" placeholder="Enter Phone Number" />
                </div>
                <div className="input-wrapper">
                  <img src={dobIcon} alt="Calendar Icon" className="input-icon" />
                  <input type="date" />
                </div>
              </div>

              {/* Passwords */}
              <div className="input-wrapper full">
                <img src={lockIcon} alt="Lock Icon" className="input-icon" />
                <input type="password" placeholder="Create Password" />
              </div>
              <div className="input-wrapper full">
                <img src={lockIcon} alt="Lock Icon" className="input-icon" />
                <input type="password" placeholder="Confirm Password" />
              </div>

              {/* Submit Button */}
              <button className="submit-button">Register</button>
              <p className="login-link">Already have an account?</p>
            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </>
  );
}

export default Register;
