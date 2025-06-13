import React from 'react';
import '../asset/css/Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">MYPARTYHOSTESS</div>
      <nav className="nav">
        <a href="#Find-Hostess">Find Hostess</a>
        <a href="#FAQs">FAQs</a>
        <a href="#How-It-Works">How It Works</a>
        <button className="btns login" onClick={() => navigate("/login")}>Log In</button>
        <button className="btns signup" onClick={() => navigate("/register")}>Sign Up</button>
      </nav>
    </header>
  );
};

export default Header;
