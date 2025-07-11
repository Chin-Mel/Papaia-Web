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
      <div className="footer-columns">
        <div className="Column1">
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>About Us</p>
          <p>Contact</p>
          <p>FAQs/Help Center</p>
        </div>
        <div className="Column2">
          <h4>Legal & Compliance</h4>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Cookie Policy</p>
        </div>
        <div className="Column3">
          <h4>Contact Us</h4>
          <div>
            <img src={instaIcon} alt="Instagram" />
            <img src={fbIcon} alt="Facebook" />
            <img src={xIcon} alt="Twitter" />
            <img src={whappIcon} alt="WhatsApp" />
            <img src={linkIcon} alt="LinkedIn" />
          </div>
          <p>Mobile: +639823648129</p>
          <p>Email: papaiatechnologies@gmail.com</p>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <img src={logo} alt="papaia-logo" className="logo" />
        <p className="copyright">© 2025 Papaia Technologies. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterMain;
