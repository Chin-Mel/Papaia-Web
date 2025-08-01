import "./HeaderMain.css";
import logo from "../../assets/papaia-logo.png";
import bellIcon from "../../assets/notif-icon.png";
import profileImage from "../../assets/default-user.png";
import { Link } from "react-router-dom";

function HeaderMain() {
  return (
    <header className="headermain">
      <div className="logo-nav-container">
        <img src={logo} alt="Papaia Logo" className="logo" />
        <nav className="nav-links">
          <Link to="/dashboard" className="dashboard">
            Dashboard
          </Link>
          <Link to="/scan-history" className="scanhistory">
            Scan History
          </Link>
          <Link to="/about" className="about">
            About
          </Link>
        </nav>
      </div>

      <div className="header-right">
        <img src={bellIcon} alt="Notifications" className="notification-icon" />
        <Link to="/about" className="about">
          <img src={profileImage} alt="User Profile" className="profile-pic" />
        </Link>
      </div>
    </header>
  );
}

export default HeaderMain;
