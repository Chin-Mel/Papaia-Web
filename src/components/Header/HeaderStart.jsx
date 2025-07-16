import './HeaderStart.css';
import logo from '../../assets/papaia-logo.png';
import { Link } from 'react-router-dom'; 

function HeaderStart() {
  return (
    <header className="headerstart">
      <div className="logo-container">
        <img src={logo} alt="papaia-logo" className="logo" />
      </div>
      <nav className="nav-links">
        <Link to="/" className="home">Home</Link>
        <Link to="/login" className="login">Login</Link>
        <Link to="/register" className="register">Register</Link>
      </nav>
    </header>
  );
}

export default HeaderStart;
