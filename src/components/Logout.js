// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    navigate('/login'); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
