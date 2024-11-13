// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbarr.css';

const Navbar = () => {
  return (
    <nav>
      <ul>
      <li><Link to="/homepage1">Home</Link></li>
        <li><Link to="/bookings">Bookings</Link></li>
        <li><Link to="/payments">Payments</Link></li>
        <li><Link to="/maintenance">Maintenance</Link></li>
        <li><Link to="/rooms">Rooms</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
