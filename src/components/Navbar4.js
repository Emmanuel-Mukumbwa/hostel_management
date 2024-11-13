// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbarr.css';

const Navbar4 = () => {
  return (
    <nav>
      <ul>
      <li><Link to="/logout">logout</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar4;
