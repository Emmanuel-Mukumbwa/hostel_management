// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userContact');
    setRole(null); // Clear the role from state

    // Redirect to the login page
    navigate('/login'); // Adjust the path as necessary
  };

  const userRole = localStorage.getItem('userRole'); // Get user role from localStorage

  return (
    <header>
      <nav>
        {/* Add your navigation links here */}
        {userRole && (
          <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
           continue to Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;