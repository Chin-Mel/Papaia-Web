import "./ForgotPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import sidePic from '../../assets/sidepic.jpg';
import logo from '../../assets/papaia-logo.png';
import mailIcon from '../../assets/mail.png';

function ForgotPassword() {
  return (
    <>
      <HeaderStart />

      <main className="forgotpassword-content-wrapper">
        <div className="forgotpassword-page-container">
          <div className="forgotpassword-side-container">
            <img src={sidePic} alt="Papaia Side Picture" className="forgotpassword-sidepic" />
          </div>

          <div className="forgotpassword-side-form">
            <div className="forgotpassword-form-container">
              <img src={logo} alt="papaia-logo" className="forgotpassword-logo" />
              <h2 className="forgotpassword-heading">Forgot Password</h2>

              <form>
                <div className="forgotpassword-input-wrapper forgotpassword-full">
                  <img src={mailIcon} alt="Mail Icon" className="forgotpassword-input-icon" />
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="forgotpassword-input"
                  />
                </div>

                <button type="submit" className="forgotpassword-submit-button">Send OTP</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ForgotPassword;
