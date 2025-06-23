// src/components/SuccessScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../asset/css/Style.css" // create this file for styling

const SuccessScreen = () => {
  const navigate = useNavigate();

  const handleProfileSetup = () => {
    navigate('/dashboard/profile'); // or any page you want
  };

  return (
    <div className="justify-its">
    <div className="success-screen">
      <img src="/images/Confetti.png" alt="Success" className="success-icon" />
      <h2>Your account has been successfully created</h2>
      <button className="setup-button" onClick={handleProfileSetup}>
        <img src="/images/UserCircle.svg" alt="profile" /> Set Up Your Profile
      </button>
    </div>
    </div>
  );
};

export default SuccessScreen;
