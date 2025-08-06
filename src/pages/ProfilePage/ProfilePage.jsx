import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";
import './ProfilePage.css';

const ICONS = {
  USER: "/src/assets/user.png",
  CALENDAR: "./assets/icons/calendar-icon.png",
  MAIL: "./assets/icons/mail-icon.png",
  ATSIGN: "./assets/icons/username-icon.png",
  PHONE: "./assets/icons/phone-icon.png"
};

const Icon = ({ src }) => (
  <img
    src={src}
    alt="Icon"
    className="input-icon"
  />
);

export default function EditProfilePage() {
  return (
    <>
      <HeaderDashboard />
      <main className="profile-page-main">
        <div className="profile-container">
          <h1 className="profile-title">Profile</h1>
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-header-info">
                <div className="profile-picture-container">
                  <img src="https://i.imgur.com/your-image.png" alt="Profile" className="profile-picture" />
                </div>
                <div>
                  <h2 className="profile-name"></h2>
                  <p className="profile-username"></p>
                </div>
              </div>
              <button className="btn btn-deactivate">Deactivate Account</button>
            </div>

            <div className="profile-form">
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" placeholder="Last Name" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" placeholder="First Name" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" placeholder="Middle Name" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" placeholder="Suffix" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" placeholder="Username" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.CALENDAR} />
                <input type="text" placeholder="mm/dd/yyyy" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.MAIL} />
                <input type="email" placeholder="Email" className="input-field placeholder-text" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.PHONE} />
                <input type="tel" placeholder="Mobile Number" className="input-field placeholder-text" />
              </div>
            </div>
          </div>

          <div className="action-buttons-container">
            <button className="btn btn-logout">Logout</button>
            <button className="btn btn-change-password">Change Password</button>
            <button className="btn btn-edit-profile">Edit Profile</button>
          </div>
        </div>
      </main>
      <FooterMain />
    </>
  );
}
