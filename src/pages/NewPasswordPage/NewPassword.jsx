import "./NewPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/login-backgroundpic.jpg';
import logo from '../../assets/papaia-logo.png';

function NewPassword() {
  return (
    <>
      <HeaderStart />

      <div className="newpassword-page-container">
        <div className="side-container">
          <img src={sidePic} alt="Papaia Side" className="sidepic" />
        </div>

        <div className="side-newpassword">
          <div className="form-container">
            <img src={logo} alt="Papaia Logo" className="form-logo" />
            <h2>Create New Password</h2>

            <div className="input-group">
              <label>Enter New Password</label>
              <input
                type="password"
                placeholder="Atleast 8 characters"
                className="password-input"
              />
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="•••••••••••"
                className="password-input"
              />
            </div>

            <button className="submit-button">Update Password</button>
          </div>
        </div>
      </div>

      <FooterMain />
    </>
  );
}

export default NewPassword;
