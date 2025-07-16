import './FooterMain.css';
import logo from '../../assets/papaia-logo.png';
import instaIcon from '../../assets/instagram-icon.png';
import fbIcon from '../../assets/facebook-icon.png';
import xIcon from '../../assets/twitter-icon.png';
import whappIcon from '../../assets/whatsapp-icon.png';
import linkIcon from '../../assets/linkedin-icon.png';

function FooterMain() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <img src={logo} alt="papaia-logo" className="logo" />
        <p className="copyright">© 2025 Papaia Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterMain;
