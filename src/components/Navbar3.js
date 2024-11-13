import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './nav.css'; // Create a CSS file for styling the Navbar

const Navbar3 = ({ onNavigate }) => {
  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => onNavigate('analytics')}>Analytics</li>
        <li onClick={() => onNavigate('roomStatus')}>Room Status</li>
        <li onClick={() => onNavigate('maintenanceRequests')}>Maintenance Requests</li>
        <li onClick={() => onNavigate('addRoom')}>Add Room</li>
        <li onClick={() => onNavigate('removeRoom')}>Remove Room</li>
        <li onClick={() => onNavigate('pendingPayments')}>Payments</li>
        <li><Link to="/logout">Logout</Link></li> 
      </ul>
    </nav>
  );
};

export default Navbar3;
