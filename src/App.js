import { useState, useEffect } from 'react';
import { Navigate, Route, Routes,  } from "react-router-dom";
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import MaintenancePage from './components/MaintenancePage';
import HomePage1 from './components/HomePage1';
import LandlordDashboard from './components/LandlordDashboard';
import Admin from './components/Admin';
import Login from './components/Login';
import MaintenanceRequests from './components/MaintenanceRequests';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';
import PaymentPage from './components/PaymentPage';
import Rooms from './components/Rooms.js';
import ImageUpload from './components/ImageUpload.js';
import Payment1 from './components/Payment1.js';

// Define the user types
const USER_TYPES = {
  PUBLIC: 'public User',
  LOGGED_USER: 'normal',
  ADMIN: 'Admin',
  LANDLORD: 'Landlord'
};

// Function to fetch user role from localStorage
function getCurrentUserRole() {
  return localStorage.getItem('userRole') || USER_TYPES.PUBLIC;
}

function App() {
  const [currentUserRole, setCurrentUserRole] = useState(getCurrentUserRole);

  // Set role when component loads
  useEffect(() => {
    const role = getCurrentUserRole();
    setCurrentUserRole(role);
  }, []);

  return (
    <div>
      
      <Routes>
        <Route path="/" element={<PublicElement><HomePage /></PublicElement>} />
        <Route path="/image" element={<PublicElement><ImageUpload /></PublicElement>} />
        <Route path="/Payment1" element={<PublicElement><Payment1 /></PublicElement>} />
        <Route path="/user" element={<UserElement role={currentUserRole}><User  /></UserElement>} />
        <Route path="/admin" element={<AdminElement role={currentUserRole}><Admin /></AdminElement>} />
        <Route path="/dashboard" element={<UserElement role={currentUserRole}><Dashboard /></UserElement>} />
        <Route path="/bookings" element={<UserElement role={currentUserRole}><BookingPage /></UserElement>} />
        <Route path="/payments" element={<UserElement role={currentUserRole}><PaymentPage /></UserElement>} />
        <Route path="/maintenance" element={<UserElement role={currentUserRole}><MaintenancePage /></UserElement>} />
        <Route path="/login" element={<Login setRole={setCurrentUserRole} />} />
        <Route path="/logout" element={<Header setRole={setCurrentUserRole} />} />
        <Route path="/signup" element={<PublicElement><SignUpForm /></PublicElement>} />
        <Route path="/homepage1" element={<UserElement role={currentUserRole}><HomePage1 /></UserElement>} />
        <Route path="/landlord" element={<LandlordElement role={currentUserRole}><LandlordDashboard /></LandlordElement>} />
        <Route path="/maintenancerequests" element={<LandlordElement role={currentUserRole}><MaintenanceRequests /></LandlordElement>} />
        <Route path="/rooms" element={<UserElement role={currentUserRole}><Rooms /></UserElement>} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
     
      
    </div>
  );
}

// Role-based element wrappers
function PublicElement({ children }) {
  return <>{children}</>;
}

function UserElement({ role, children }) {
  if (role === USER_TYPES.ADMIN || role === USER_TYPES.LANDLORD || role === USER_TYPES.LOGGED_USER) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" />;
  }
}

function AdminElement({ role, children }) {
  if (role === USER_TYPES.ADMIN) {
    return <>{children}</>;
  } else {
    return <div>No access</div>;
  }
}

function LandlordElement({ role, children }) {
  if (role === USER_TYPES.LANDLORD || role === USER_TYPES.ADMIN) {
    return <>{children}</>;
  } else {
    return <div>No access</div>;
  }
}

// Other components (User , Admin, etc.)
function User() { return <div>User Page</div>; }
function Dashboard() { return <div>Dashboard</div>; }


export default App;