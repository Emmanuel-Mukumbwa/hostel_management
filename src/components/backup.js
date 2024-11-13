import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandlordDashboard.css';
import Navbar3 from './Navbar3'; // Import the Navbar component
import Navbar4 from './Navbar4';
import ImageModal from './ImageModal';

const LandlordDashboard = () => {
  const [payments, setPayments] = useState([]); // State for payment data
  const [roomDetails, setRoomDetails] = useState([]); // State for room details
  const [pendingPayments, setPendingPayments] = useState([]); // State for pending payments
  const [requests, setRequests] = useState([]); // State for maintenance requests
  const [rooms, setRooms] = useState([]); // State for room data
  const [analytics, setAnalytics] = useState({
    total_rooms: 0,
    available_rooms: 0,
    unavailable_rooms: 0,
    reserved_rooms: 0,
    total_requests: 0,
    completed_requests: 0,
    pending_requests: 0,
    confirmed_payments: 0,
    pending_payments: 0,
  });
  const [replyData, setReplyData] = useState({ message: '', scheduledDate: '' });
  const [replyingRequestId, setReplyingRequestId] = useState(null);
  
  // State for adding new room
  const [newRoom, setNewRoom] = useState({ name: '', type: '', price: '', room_number: '', isAvailable: 1, number_of_beds: '' });
  const [roomToRemove, setRoomToRemove] = useState("");

  // Pagination state
  const [requestPage, setRequestPage] = useState(0);
  const [roomPage, setRoomPage] = useState(0);
  const itemsPerPage = 3; // Number of items to display per page

  // State for currently active section
  const [activeSection, setActiveSection] = useState('analytics'); // Set analytics as the default section

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Fetch room details
  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get('http://localhost/api/getRoomDetails.php'); // API endpoint to fetch room details
      if (response.data.success) {
        setRoomDetails(response.data.room_details); // Set room details only if the response is successful
      } else {
        console.error('Failed to fetch room details:', response.data.message);
        setRoomDetails([]); // Handle error case
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      setRoomDetails([]); // Handle error case
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost/api/get_payments.php'); // API to fetch all payments
      console.log('Payments Response:', response.data); // Debugging line
      setPendingPayments(response.data.payments || []); // Set payments data
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handlePaymentAction = async (paymentId, action) => {
    if (action === 'confirm-payment') {
      try {
        const response = await axios.post('http://localhost/api/confirmPayment.php', {
          paymentId,
        });
        if (response.data.success) {
          alert('Payment confirmed successfully!');
          // Refresh pending payments
          const fetchResponse = await axios.get('http://localhost/api/getPendingPayments.php');
          setPendingPayments(fetchResponse.data.payments || []);
        } else {
          alert('Failed to confirm payment: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Failed to confirm payment: ' + error.message);
      }
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost/api/getMaintenanceRequests.php');
        console.log('Fetched requests:', response.data); // Debugging line
        setRequests(Array.isArray(response.data.requests) ? response.data.requests : []);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        setRequests([]); // Handle error case
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost/api/getRoomAnalytics.php');
        const maintenanceResponse = await axios.get('http://localhost/api/getMaintenanceAnalytics.php');
        const paymentResponse = await axios.get('http://localhost/api/getPayments1.php');
        
        setAnalytics({
          total_rooms: response.data.total_rooms,
          available_rooms: response.data.available_rooms,
          unavailable_rooms: response.data.unavailable_rooms,
          reserved_rooms: response.data.reserved_rooms,
          total_requests: maintenanceResponse.data.total_requests,
          completed_requests: maintenanceResponse.data.completed_requests,
          pending_requests: maintenanceResponse.data.pending_requests,
          confirmed_payments: paymentResponse.data.confirmed_payments,
          pending_payments: paymentResponse.data.pending_payments,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    const fetchPendingPayments = async () => {
      try {
        const response = await axios.get('http://localhost/api/getPendingPayments.php'); // API to fetch pending payments
        console.log('Pending Payments Response:', response.data); // Debugging line
        setPendingPayments(response.data.payments || []); // Set pending payments data
      } catch (error) {
        console.error('Error fetching pending payments:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost/api/getRooms1.php');
        setRooms(response.data.rooms || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]); // Handle error case
      }
    };

    const fetchData = async () => {
      await fetchRequests();
      await fetchRooms();
      await fetchAnalytics();
      await fetchPendingPayments(); // Fetch pending payments
      await fetchRoomDetails(); // Fetch room details
      await fetchPayments(); // Fetch all payments (pending and confirmed)
    };

    fetchData();

    // Refresh analytics data every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Log pending payments whenever it changes
  useEffect(() => {
    console.log('Pending Payments:', pendingPayments); // Log pending payments to verify
  }, [pendingPayments]);

  const toggleDetails = (index) => {
    const element = document.getElementById(`details-${index}`);
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  };

  const handleReplySubmit = async (requestId) => {
    try {
      const response = await axios.post('http://localhost/api/sendReply.php', {
        requestId,
        message: replyData.message,
        scheduledDate: replyData.scheduledDate,
      });
      
      if (response.data.success) {
        alert('Reply sent successfully!');
        setReplyingRequestId(null);
        setReplyData({ message: '', scheduledDate: '' });
        
        // Refresh the requests to show the new reply
        const fetchResponse = await axios.get('http://localhost/api/getMaintenanceRequests.php');
        setRequests(fetchResponse.data.requests || []);
      } else {
        alert('Failed to send reply: ' + response.data.message); // Display the specific error message
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply: ' + error.message);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost/api/addRoom.php', {
        name: newRoom.name,
        type: newRoom.type,
        price: newRoom.price,
        room_number: newRoom.room_number,
        isAvailable: newRoom.isAvailable,
        number_of_beds: newRoom.number_of_beds
      });

      if (response.data.success) {
        alert('Room added successfully!');
        setNewRoom({ name: '', type: '', price: '', room_number: '', isAvailable: 1, number_of_beds: '' });
        const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
        setRooms(fetchResponse.data.rooms || []);
      } else {
        alert('Failed to add room');
      }
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleRemoveRoom = async () => {
    if (roomToRemove !== null) {
      try {
        const response = await axios.delete(`http://localhost/api/removeRoom.php`, {
          data: { roomNumber: roomToRemove },
        });
        if (response.data.success) {
          alert('Room removed successfully!');
          setRoomToRemove(null);
          const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
          setRooms(fetchResponse.data.rooms || []);
        } else {
          alert('Failed to remove room');
        }
      } catch (error) {
        console.error('Error removing room:', error);
      }
    }
  };

  const handleRoomStatusChange = async (roomId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await axios.post('http://localhost/api/updateRoomStatus.php', {
        roomId,
        isAvailable: newStatus,
      });
      if (response.data.success) {
        alert('Room status updated successfully!');
        const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
        setRooms(fetchResponse.data.rooms || []);
      } else {
        alert('Failed to update room status');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  };

  const handleActionSelect = async (roomId, action) => {
    try {
      if (action === 'mark-available') {
        const response = await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 1,
        });
        if (!response.data.success) {
          throw new Error('Failed to mark room as available');
        }
      } else if (action === 'mark-unavailable') {
        const response = await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 0,
        });
        if (!response.data.success) {
          throw new Error('Failed to mark room as unavailable');
        }
      } else if (action === 'cancel-reservation') {
        const response = await axios.post('http://localhost/api/updateReservationStatus.php', {
          roomId,
          status: 'canceled',
        });
        if (!response.data.success) {
          throw new Error('Failed to cancel reservation');
        }
        await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 1,
        });
      }

      const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
      setRooms(fetchResponse.data.rooms || []);

      alert('Action completed successfully!');
    } catch (error) {
      console.error('Error handling action:', error);
      alert('Failed to perform the action: ' + error.message);
    }
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const currentRequests = requests.slice(requestPage * itemsPerPage, (requestPage + 1) * itemsPerPage);
  const currentRooms = rooms.slice(roomPage * itemsPerPage, (roomPage + 1) * itemsPerPage);

  const handlePreviousRequests = () => {
    if (requestPage > 0) {
      setRequestPage(requestPage - 1);
    }
  };

  const handleNextRequests = () => {
    if (requests.length > (requestPage + 1) * itemsPerPage) {
      setRequestPage(requestPage + 1);
    }
  };

  const handlePreviousRooms = () => {
    if (roomPage > 0) {
      setRoomPage(roomPage - 1);
    }
  };

  const handleNextRooms = () => {
    if (rooms.length > (roomPage + 1) * itemsPerPage) {
      setRoomPage(roomPage + 1);
    }
  };



  return (
    <div className="landlord-dashboard">
      <h1>Landlord Dashboard</h1>
      <Navbar3 onNavigate={handleNavigate} />

      {activeSection === 'analytics' && (
        <div>
          {/* Analytics Section */}
          <h1>Overview</h1>
          <div className="analytics-section">
            <div className="analytics-card total">
              <h3>Total Rooms: {analytics.total_rooms}</h3>
            </div>
            <div className="analytics-card available">
              <h3>Available Rooms: {analytics.available_rooms}</h3>
            </div>
            <div className="analytics-card unavailable">
              <h3>Unavailable Rooms: {analytics.unavailable_rooms}</h3>
            </div>
            <div className="analytics-card reserved">
              <h3>Reserved Rooms: {analytics.reserved_rooms}</h3>
            </div>
          </div>
          <div className="analytics-section">
            <div className="analytics-card confirmed-payments">
              <h3>Confirmed Payments: {analytics.confirmed_payments}</h3>
            </div>
            <div className="analytics-card pending-payments">
              <h3>Pending Payments: {analytics.pending_payments}</h3>
            </div>
          </div>
          <div className="analytics-section">
            <div className="analytics-card completed">
              <h3>Completed Requests: {analytics.completed_requests}</h3>
            </div>
            <div className="analytics-card pending">
              <h3>Pending Requests: {analytics.pending_requests}</h3>
            </div>
          </div>
        </div>
      )}
      {activeSection === 'roomStatus' && (
        <div>
          {/* Room Status Table */}
          <h1>Room Status</h1>
          <table className="room-status-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Number</th>
                <th>Status</th>
                <th>Reservation Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(currentRooms) && currentRooms.length > 0 ? (
                currentRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.name}</td>
                    <td>{room.room_number}</td>
                    <td>{room.is_available === 1 ? 'Available' : 'Unavailable'}</td>
                    <td>{room.reservation_status !== 'none' ? room.reservation_status.charAt(0).toUpperCase() + room.reservation_status.slice(1) : 'Not Reserved'}</td>
                    <td>
                      <select
                        onChange={(e) => handleActionSelect(room.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Action</option>
                        {room.is_available === 1 ? (
                          <option value="mark-unavailable">Mark Unavailable</option>
                        ) : (
                          <>
                            <option value="mark-available">Mark Available</option>
                            {room.reservation_status !== 'none' && (
                              <option value="cancel-reservation">Cancel Reservation</option>
                            )}
                          </>
                        )}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No rooms found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination for Room Status */}
          <div className="pagination">
            <button onClick={handlePreviousRooms} disabled={roomPage === 0}>
              Previous
            </button>
            <button onClick={handleNextRooms} disabled={rooms.length <= (roomPage + 1) * itemsPerPage}>
              Next
            </button>
          </div>
        </div>
      )}
      {activeSection === 'maintenanceRequests' && (
        <div>
          {/* Maintenance Requests List */}
          <h1>Maintenance Requests</h1>
          <div className="request-list">
            {Array.isArray(requests) && requests.length > 0 ? (
              requests.map((request, index) => (
                <div key={request.id} className="request-card">
                  <div className="request-header" onClick={() => toggleDetails(index)}>
                    <h3>{request.category}</h3>
                    <span className="toggle-arrow">▼</span>
                  </div>

                  <div id={`details-${index}`} className="request-details" style={{ display: 'none' }}>
                    <p>{request.description}</p>
                    <p>Status: {request.status}</p>
                    <p>Room Number: {request.room_number}</p>
                    <p>Requested on: {new Date(request.created_at).toLocaleString()}</p>
                    <p>Requested by: {request.username}</p>

                    {replyingRequestId === request.id ? (
                      <div>
                        <textarea
                          placeholder="Enter your reply"
                          value={replyData.message}
                          onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                          required
                        />
                        <input
                          type="date"
                          value={replyData.scheduledDate}
                          onChange={(e) => setReplyData({ ...replyData, scheduledDate: e.target.value })}
                          required
                        />
                        <button onClick={() => handleReplySubmit(request.id)}>Send Reply</button>
                        <button onClick={() => setReplyingRequestId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setReplyingRequestId(request.id)}>Reply</button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No maintenance requests found.</p>
            )}
          </div>

          {/* Pagination for Maintenance Requests */}
          <div className="pagination">
            <button onClick={handlePreviousRequests} disabled={requestPage === 0}>
              Previous
            </button>
            <button onClick={handleNextRequests} disabled={requests.length <= (requestPage + 1) * itemsPerPage}>
              Next
            </button>
          </div>
        </div>
      )}
      {activeSection === 'addRoom' && (
        <div>
          {/* Add New Room Form */}
          <h1>Add New Room</h1>
          <form onSubmit={handleAddRoom}>
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e
              .value })}
              required
            />
      
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              required
            >
              <option value="" disabled>Select Room Type</option>
              {roomDetails.map((detail) => (
                <option key={detail.id} value={detail.id}>
                  {detail.type} - ${detail.price} (Beds: {detail.number_of_beds})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Room Number"
              value={newRoom.room_number}
              onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
              required
            />
            
            <label>
              Available:
              <input
                type="checkbox"
                checked={newRoom.isAvailable === 1}
                onChange={(e) => setNewRoom({ ...newRoom, isAvailable: e.target.checked ? 1 : 0 })}
              />
            </label>
            <button type="submit">Add Room</button>
          </form>
        </div>
      )}
      {activeSection === 'removeRoom' && (
        <div>
          {/* Remove Room Form */}
          <h1>Remove Room</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleRemoveRoom(); }}>
            <select
              value={roomToRemove}
              onChange={(e) => setRoomToRemove(e.target.value)}
            >
              <option value="">Select a room to remove</option>
              {rooms.map((room) => (
                <option key={room.room_number} value={room.room_number}>
                  {room.name} (Room Number: {room.room_number})
                </option>
              ))}
            </select>
            <button type="submit">Remove Room</button>
          </form>
        </div>
      )}
  {activeSection === 'pendingPayments' && (
        <div>
          {/* Pending Payments Table */}
          <h1>Payments</h1>
          <table className="pending-payments-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Room Number</th>
                <th>Duration</th>
                <th>Total Price</th>
                <th>Payment Proof</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pendingPayments) && pendingPayments.length > 0 ? (
                pendingPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.username}</td>
                    <td>{payment.email}</td>
                    <td>{payment.room_number}</td>
                    <td>{payment.duration}</td>
                    <td>{payment.total_price}</td>
                    <td>
                      {/* Clickable image to open modal */}
                      {payment.payment_proof ? (
                        <img 
                          src={payment.payment_proof} 
                          alt="Payment Proof" 
                          width="100" 
                          style={{ borderRadius: '5px', cursor: 'pointer' }} 
                          onClick={() => handleImageClick(payment.payment_proof)} // Open modal on click
                        />
                      ) : (
                        <span>No proof available</span>
                      )}
                    </td>
                    <td>{payment.status}</td>
                    <td>
                      <select
                        onChange={(e) => handlePaymentAction(payment.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select Action</option>
                        {payment.status === 'pending' && (
                          <option value="confirm-payment">Confirm Payment</option>
                        )}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="8">No payments found.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        imageUrl={selectedImage} 
      />

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 LOGO Hostel</p>
        <div className="social-media">
          <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default LandlordDashboard;