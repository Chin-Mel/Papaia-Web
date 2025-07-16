import "./Login.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/sidepic.jpg';
import logo from '../../assets/papaia-logo.png';
import userIcon from '../../assets/user.png';
import lockIcon from '../../assets/password.png';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <>
      <HeaderStart />

      <main className="login-content-wrapper">
        <div className="login-page-container">
          <div className="login-side-container">
            <img src={sidePic} alt="Papaia Side Picture" className="login-sidepic" />
          </div>

          <div className="login-side-form">
            <div className="login-form-container">
              <img src={logo} alt="papaia-logo" className="login-logo" />
              <h2 className="login-heading">Login</h2>

              <form>
                <div className="login-input-wrapper login-full">
                  <img src={userIcon} alt="User Icon" className="login-input-icon" />
                  <input type="text" placeholder="Enter Username" className="login-input" />
                </div>

                <div className="login-input-wrapper login-full">
                  <img src={lockIcon} alt="Lock Icon" className="login-input-icon" />
                  <input type="password" placeholder="Enter Password" className="login-input" />
                </div>

                <div className="login-helper-links">
                  <Link to="/forgot-password" className="login-forgot-password">Forgot Password?</Link>
                  <Link to="/register" className="login-register-link">Register</Link>
                </div>

                <button type="submit" className="login-submit-button">Log In</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Login;
