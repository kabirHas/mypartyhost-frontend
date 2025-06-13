// import React, { useState } from 'react';
// import API from '../api';
// import { useNavigate } from 'react-router-dom';
// import '../asset/css/Style.css'; // Ensure you style your components accordingly

// const Register = () => {
//   const [step, setStep] = useState(1);
//   const [role, setRole] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const navigate = useNavigate();

//   const handleRoleSelect = (selectedRole) => {
//     setRole(selectedRole);
//     setStep(2);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await API.post('/auth/register', {
//       name,
//       email,
//       phone,
//       role,
//     });
//     navigate('/login');
//   };

//   return (
//     <div className="register-container">
//       {step === 1 ? (
//         <div className="role-selection">
//           <h2>Create Account</h2>
//           <div className="role-card" onClick={() => handleRoleSelect('organiser')}>
//             <img src="/icons/organiser-icon.png" alt="organiser" />
//             <h3>Event Organiser</h3>
//             <p>Host events, hire staff</p>
//           </div>
//           <div className="role-card" onClick={() => handleRoleSelect('hostess')}>
//             <img src="/icons/hostess-icon.png" alt="hostess" />
//             <h3>Event Hostess</h3>
//             <p>Host parties, get booked</p>
//           </div>
//         </div>
//       ) : (
//         <form className="register-form" onSubmit={handleSubmit}>
//           <h2>Create Account</h2>
//           <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
//           <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" required />
//           <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone" required />
//           <input type="hidden" value={role} />
//           <button className="button-app" type="submit">Create Account</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import axios from "axios"; // using axios directly since you're calling an external API
import { useNavigate } from "react-router-dom";
import "../asset/css/Style.css";
import BASE_URLS from "../config";
import Notify from "../utils/notify";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URLS.API}/auth/register`, {
        name,
        email,
        phone,
        role,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      Notify.success("Account created successfully!");
      navigate("/success");
    } catch (err) {
      console.error(err);
      Notify.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      {step === 1 ? (
        <div className="role-selection">
          <h2>Create Account</h2>
          <div
            className="role-card"
            onClick={() => handleRoleSelect("organiser")}
          >
            <img src="/images/event.png" alt="organiser" />
            <div>
              <h3>Event Organiser</h3>
              <p>Host events, hire staff</p>
            </div>
          </div>
          <div className="role-card" onClick={() => handleRoleSelect("staff")}>
            <img src="/images/hostess.png" alt="hostess" />
            <div>
              <h3>Event Hostess</h3>
              <p>Host parties, get booked</p>
            </div>
          </div>
        </div>
      ) : (
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter Phone"
            required
          />
          <input type="hidden" value={role} readOnly />
          <button className="button-app" type="submit">
            Create Account
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
