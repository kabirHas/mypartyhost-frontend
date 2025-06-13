import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getStaticRoutes, generateDynamicRoutes } from './routes/routes';
import BASE_URLS from './config';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [pages, setPages] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token') ;


  useEffect(() => {
    fetch(`${BASE_URLS.BACK}/api/pages`)
      .then(res => res.json())
      .then(data => setPages(data))
      .catch(err => {
        console.error('Error fetching pages:', err);
        setPages([]); 
      });
  }, []);

  if (pages === null) return <div>Loading...</div>;

  return (
    <Router>
      <ToastContainer/>
      <Routes>
        {getStaticRoutes(isLoggedIn)}
        {generateDynamicRoutes(pages)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;



