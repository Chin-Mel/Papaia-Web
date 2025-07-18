import './HeaderDashboard.css';
import logo from '../../assets/papaia-logo.png';
function HeaderDashboard() {
  return (
    <header className="headerdashboard">
      <div className="logo-container">
        <img src={logo} alt="papaia-logo" className="logo" />
      </div>
      <nav className="nav-links">
        <a href="#" className="dashboard">Dashboard</a>
        <a href="#" className="scan-history">Scan History</a>
        <a href="#" className="about">About</a>
      </nav>
    </header>
  );
}
export default HeaderDashboard;
