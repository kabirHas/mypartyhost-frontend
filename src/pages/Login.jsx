// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import API from '../api';
// import '../asset/css/Style.css'; // CSS file import

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post('/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login failed', err);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <div className="form-header">
//           <h2>Login</h2>
//           <Link to="/register" className="create-account">Create Account</Link>
//         </div>
//         <input
//           type="email"
//           placeholder="Enter Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <div className="form-options">
//           <label>
//             <input type="checkbox" /> Remember Me
//           </label>
//           <Link to="#" className="forgot-password">Forgot Password</Link>
//         </div>
//         <button type="submit" className="login-button">Login</button>
//         <div className="divider">or</div>
//         <div className="social-buttons">
//           <button type="button" className="google-button">
//             <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" /> Continue with Google
//           </button>
//           <button type="button" className="apple-button">
//             <img src="https://img.icons8.com/ios-filled/16/000000/mac-os.png" alt="Apple" /> Continue with Apple
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Using axios directly for external API
import '../asset/css/Style.css';
import BASE_URLS from '../config';
import Notify from '../utils/notify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URLS.API}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      Notify.error('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Login</h2>
          <Link to="/register" className="create-account">Create Account</Link>
        </div>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="form-options">
          <label>
            <input type="checkbox" /> Remember Me
          </label>
          <Link to="#" className="forgot-password">Forgot Password</Link>
        </div>
        <button type="submit" className="login-button">Login</button>
        <div className="divider">or</div>
        <div className="social-buttons">
          <button type="button" className="google-button">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" /> Continue with Google
          </button>
          <button type="button" className="apple-button">
            <img src="https://img.icons8.com/ios-filled/16/000000/mac-os.png" alt="Apple" /> Continue with Apple
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
