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
import { Link } from 'react-router-dom';


function Register() {
  return (
    <>
      <HeaderStart />

      <main className="register-content-wrapper">
        <div className="register-page-container">

          <div className="side-container">
            <img src={sidePic} alt="Papaia Background" className="sidepic" />
          </div>

          <div className="side-register">
            <div className="form-container">
              <img src={logo} alt="Papaia Logo" className="form-logo" />
              <h2>Register</h2>

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

              <div className="input-wrapper full">
                <img src={userIcon} alt="User Icon" className="input-icon" />
                <input type="text" placeholder="Enter Username" />
              </div>

              <div className="input-wrapper full">
                <img src={emailIcon} alt="Email Icon" className="input-icon" />
                <input type="email" placeholder="Enter Email Address" />
              </div>

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

              <div className="input-wrapper full">
                <img src={lockIcon} alt="Lock Icon" className="input-icon" />
                <input type="password" placeholder="Create Password" />
              </div>
              <div className="input-wrapper full">
                <img src={lockIcon} alt="Lock Icon" className="input-icon" />
                <input type="password" placeholder="Confirm Password" />
              </div>

              <button className="submit-button">Register</button>
              <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
              </p>

            </div>
          </div>
        </div>
      </main>

      <FooterMain />
    </>
  );
}

export default Register;
