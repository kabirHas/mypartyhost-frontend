import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getStaticRoutes, generateDynamicRoutes } from './routes/routes';
import BASE_URLS from './config';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [pages, setPages] = useState(null);
  // const isLoggedIn = !!localStorage.getItem('token') ;
  // const userRole = localStorage.getItem('role') ;

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));


  useEffect(() => {
    fetch(`${BASE_URLS.BACK}/api/pages`)
      .then(res => res.json())
      .then(data => setPages(data))
      .catch(err => {
        console.error('Error fetching pages:', err);
        setPages([]); 
      });
  }, []);


  useEffect(() => {
    const handleLogin = () => { 
      setIsLoggedIn(true);
      setUserRole(localStorage.getItem('role'));
    };

    window.addEventListener("user-logged-in", handleLogin);
    return () => window.removeEventListener("user-logged-in", handleLogin);
  }, []);

  if (pages === null) return <div>Loading...</div>;

  return (
    <Router>
      <ToastContainer/>
      <Routes>
        {getStaticRoutes(isLoggedIn, userRole)}
        {generateDynamicRoutes(pages)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;



