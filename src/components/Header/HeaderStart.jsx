import './HeaderStart.css';
import logo from '../../assets/papaia-logo.png';

function HeaderStart() {
  return (
    <header className="headerstart">
      <div className="logo-container">
        <img src={logo} alt="papaia-logo" className="logo" />
      </div>
      <nav className="nav-links">
        <a href="#" className="home">Home</a>
        <a href="#" className="login">Login</a>
        <a href="#" className="register">Register</a>
      </nav>
    </header>
  );
}

export default HeaderStart;
