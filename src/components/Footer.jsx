import React from 'react';
import '../asset/css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h2 className="logo">MYPARTYHOSTESS</h2>
        <div className="social-icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-tiktok"></i>
          <i className="fab fa-snapchat-ghost"></i>
          <i className="fab fa-youtube"></i>
        </div>
        <div className="footer-links">
          <a href="#">Find Hostess</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>

      <div className="footer-right">
        <p className="subscribe-title">SUBSCRIBE TO GET UPDATES</p>
        <div className="subscribe-form">
          <input type="email" placeholder="Enter email" />
          <button>SUBSCRIBE</button>
        </div>
        <p className="copyright">© 2025 MyPartyHostess.com. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
