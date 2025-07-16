import "./Register.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from '../../assets/sidepic.jpg';
import logo from '../../assets/papaia-logo.png';
import userIcon from '../../assets/user.png';
import emailIcon from '../../assets/mail.png';
import phoneIcon from '../../assets/call.png';
import dobIcon from '../../assets/calendar.png';
import lockIcon from '../../assets/password.png';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function Register() {
  const dobRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [maxDob, setMaxDob] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    setMaxDob(today.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dobValue = new Date(dobRef.current.value);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dobValue.getFullYear();
    const m = currentDate.getMonth() - dobValue.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < dobValue.getDate())) {
      age--;
    }

    if (age < 18) {
      setErrorMsg("You must be at least 18 years old to register.");
    } else {
      setErrorMsg("");
      alert("Form submitted successfully!");
    }
  };

  return (
    <>
      <HeaderStart />
      <main className="register-content-wrapper">
        <div className="register-page-container">
          <div className="register-side-container">
            <img src={sidePic} alt="Papaia Background" className="register-sidepic" />
          </div>

          <div className="register-side-form">
            <div className="register-form-container">
              <img src={logo} alt="papaia-logo" className="register-logo" />
              <h2 className="register-heading">Register</h2>

              <form onSubmit={handleSubmit}>
                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <img src={userIcon} alt="User Icon" className="register-input-icon" />
                    <input type="text" placeholder="Enter Last Name" />
                  </div>
                  <div className="register-input-wrapper">
                    <img src={userIcon} alt="User Icon" className="register-input-icon" />
                    <input type="text" placeholder="Enter First Name" />
                  </div>
                </div>

                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <img src={userIcon} alt="User Icon" className="register-input-icon" />
                    <input type="text" placeholder="Enter Middle Name" />
                  </div>
                  <div className="register-input-wrapper">
                    <img src={userIcon} alt="User Icon" className="register-input-icon" />
                    <input type="text" placeholder="Enter Suffix Jr., III..." />
                  </div>
                </div>

                <div className="register-input-wrapper register-full">
                  <img src={userIcon} alt="User Icon" className="register-input-icon" />
                  <input type="text" placeholder="Enter Username" />
                </div>

                <div className="register-input-wrapper register-full">
                  <img src={emailIcon} alt="Email Icon" className="register-input-icon" />
                  <input type="email" placeholder="Enter Email Address" />
                </div>

                <div className="register-double-row">
                  <div className="register-input-wrapper">
                    <img src={phoneIcon} alt="Phone Icon" className="register-input-icon" />
                    <input type="tel" placeholder="Enter Phone Number" />
                  </div>
                  <div className="register-input-wrapper">
                    <img src={dobIcon} alt="Calendar Icon" className="register-input-icon" />
                    <input type="date" ref={dobRef} required max={maxDob} />
                  </div>
                </div>

                <div className="register-input-wrapper register-full">
                  <img src={lockIcon} alt="Lock Icon" className="register-input-icon" />
                  <input type="password" placeholder="Create Password" />
                </div>

                <div className="register-input-wrapper register-full">
                  <img src={lockIcon} alt="Lock Icon" className="register-input-icon" />
                  <input type="password" placeholder="Confirm Password" />
                </div>

                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

                <button type="submit" className="register-submit-button">Register</button>
              </form>

              <p className="register-login-link">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Register;
