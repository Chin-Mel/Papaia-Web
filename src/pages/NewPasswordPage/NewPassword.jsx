import "./NewPassword.css";
import HeaderStart from "../../components/Header/HeaderStart";
import FooterMain from "../../components/Footer/FooterMain";
import sidePic from '../../assets/sidepic.jpg';
import logo from '../../assets/papaia-logo.png';

function NewPassword() {
  return (
    <>
      <HeaderStart />

      <main className="newpassword-content-wrapper">
        <div className="newpassword-page-container">
          {/* Left Side Image */}
          <div className="newpassword-side-container">
            <img src={sidePic} alt="Papaia Side" className="newpassword-sidepic" />
          </div>

          {/* Right Side Form */}
          <div className="newpassword-side-form">
            <div className="newpassword-form-container">
              <img src={logo} alt="Papaia Logo" className="newpassword-logo" />
              <h2 className="newpassword-heading">Create New Password</h2>

              <div className="newpassword-input-wrapper">
                <label className="newpassword-label">Enter New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="newpassword-input"
                />
              </div>

              <div className="newpassword-input-wrapper">
                <label className="newpassword-label">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="•••••••••••"
                  className="newpassword-input"
                />
              </div>

              <button className="newpassword-submit-button">Update Password</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default NewPassword;
