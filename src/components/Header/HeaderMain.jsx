import './HeaderMain.css';
import logo from '../../assets/papaia-logo.png';
import bellIcon from '../../assets/notif-icon.png';
import profileImage from '../../assets/profile.png';

function HeaderMain() {
  return (
    <header className="headermain">
      <div className="logo-nav-container">
        <img src={logo} alt="Papaia Logo" className="logo" />
        <nav className="nav-links">
          <a href="#" className="dashboard">Dashboard</a>
          <a href="#" className="scanhistory">Scan History</a>
          <a href="#" className="about">About</a>
        </nav>
      </div>

      <div className="header-right">
        <img src={bellIcon} alt="Notifications" className="notification-icon" />
        <img src={profileImage} alt="User Profile" className="profile-pic" />
      </div>
    </header>
  );
}

export default HeaderMain;
