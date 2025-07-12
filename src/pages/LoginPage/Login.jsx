import "./Login.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/login-backgroundpic.jpg';
import logo from '../../assets/papaia-logo.png';
import userIcon from '../../assets/user.png';
import lockIcon from '../../assets/password.png';
import { Link } from 'react-router-dom'; // ✅ Added this

function Login() {
  return (
    <>
      <HeaderStart />

      <div className="login-page-container">
        <div className="side-container">
          <img src={sidePic} alt="Papaia Side Picture" className="sidepic" />
        </div>

        <div className="side-login">
          <div className="logo-container-login">
            <img src={logo} alt="papaia-logo" className="logo-login" />
            <h2>Login</h2>

            <h4>Username</h4>
            <div className="input-wrapper">
              <img src={userIcon} alt="User Icon" className="input-icon" />
              <input type="text" placeholder="Username" className="login-input" />
            </div>

            <h4>Password</h4>
            <div className="input-wrapper">
              <img src={lockIcon} alt="Lock Icon" className="input-icon" />
              <input type="password" placeholder="Password" className="login-input" />
            </div>

            <div className="helper-links">
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              <Link to="/register" className="register">Register</Link>
            </div>

            <button className="login-button">Log In</button>
          </div>
        </div>
      </div>

      <FooterMain />
    </>
  );
}

export default Login;
