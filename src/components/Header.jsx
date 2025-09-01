import React, { useState } from 'react';
import '../asset/css/Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">MYPARTYHOSTESS</div>

      {/* Hamburger */}
      <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation */}
      <nav className={`nav ${menuOpen ? "show" : "hide"}`}>
        <a href="#Find-Hostess" onClick={closeMenu}>Find Hostess</a>
        <a href="#FAQs" onClick={closeMenu}>FAQs</a>
        <a href="#How-It-Works" onClick={closeMenu}>How It Works</a>
        <button className="btns login" onClick={() => { closeMenu(); navigate("/login"); }}>Log In</button>
        <button className="btns signup" onClick={() => { closeMenu(); navigate("/register"); }}>Sign Up</button>
      </nav>
    </header>
  );
};

export default Header;
