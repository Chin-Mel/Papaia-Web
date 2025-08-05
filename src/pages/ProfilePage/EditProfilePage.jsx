import HeaderDashboard from "../../components/Header/HeaderDashboard";
import FooterMain from "../../components/Footer/FooterMain";
import './EditProfilePage.css';

const ICONS = {
  USER: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  CALENDAR: "M8 2v4m8-4v4M3.5 10h17M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
  MAIL: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  ATSIGN: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 2v10m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 4v2a2 2 0 1 1-4 0v-2",
  PHONE: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
};

const Icon = ({ path }) => (
  <svg
    className="input-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
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
                  <h2 className="profile-name">Juan Dela Cruz</h2>
                  <p className="profile-username">@juandelacruz</p>
                </div>
              </div>
              <button className="btn btn-deactivate">Deactivate Account</button>
            </div>

            <div className="profile-form">
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" defaultValue="Dela Cruz" className="input-field" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.USER} />
                <input type="text" defaultValue="Juan" className="input-field" />
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
                <Icon path={ICONS.ATSIGN} />
                <input type="text" defaultValue="@juandelacruz" className="input-field" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.CALENDAR} />
                <input type="text" defaultValue="2/3/2003" className="input-field" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.MAIL} />
                <input type="email" defaultValue="juandelacruz@gmail.com" className="input-field" />
              </div>
              <div className="input-container">
                <Icon path={ICONS.PHONE} />
                <input type="tel" defaultValue="09283492834" className="input-field" />
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
