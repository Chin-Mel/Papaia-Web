import './HeaderDashboard.css';
import logo from '../../assets/papaia-logo.png';

function HeaderDashboard() {
  return (
    <header className="headerdashboard">
      <div className="header-left">
        <div className="logo-container">
          <img src={logo} alt="papaia-logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="/dashboard" className="nav-link header-dashboard">Dashboard</a>
          <a href="/scan-history" className="nav-link scan-history">Scan History</a>
          <a href="/about" className="nav-link about">About</a>
        </nav>
      </div>

      <div className="header-right">
        <div className="notification-container">
          <button className="notification-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="user-profile">
          <div className="user-avatar">
            <img src="/src/assets/profile-user.png" alt="User Avatar" className="avatar-image" />
          </div>
          <button className="dropdown-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderDashboard;