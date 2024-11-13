import React from 'react';
import './dashboard.css';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <ul>
          <li>Dashboard</li>
          <li>Booked Rooms</li>
          <li>Payment History</li>
          <li>Reported Issues</li>
        </ul>
      </div>

      <div className="dashboard-content">
        <h1>Student Dashboard</h1>

        {/* Student Details Section */}
        <div className="student-details">
          <h2>Student Details</h2>
          <p>Name: Emmanuel</p>
          <p>Student ID: 1234</p>
          <p>Email: emmamuel@student.com</p>
        </div>

        {/* Cards Section */}
        <div className="card-container">
          <div className="dashboard-card">
            <h2>Booked Rooms</h2>
            <ul>
              <li>Room 101 - Booked</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h2>Payment History</h2>
            <ul>
              <li>Room 101 - MK45000 - Paid</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h2>Reported Issues</h2>
            <ul>
              <li>Room 101 - Leaky faucet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;