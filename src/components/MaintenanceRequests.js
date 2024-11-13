import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [replyData, setReplyData] = useState({ message: '', scheduledDate: '' });
  const [replyingRequestId, setReplyingRequestId] = useState(null);

  // Pagination state
  const [requestPage, setRequestPage] = useState(0);
  const [roomPage, setRoomPage] = useState(0);
  const itemsPerPage = 3; // Number of items to display per page

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost/api/getMaintenanceRequests.php');
        setRequests(response.data.requests || response.data);
      } catch (error) {
        console.error('Error fetching maintenance requests:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost/api/getRooms1.php');
        setRooms(response.data.rooms || response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRequests();
    fetchRooms();
  }, []);

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
        const fetchResponse = await axios.get('http://localhost/api/getMaintenanceRequests.php');
        setRequests(fetchResponse.data.requests || fetchResponse.data);
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleRoomStatusChange = async (roomId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status
      const response = await axios.post('http://localhost/api/updateRoomStatus.php', {
        roomId,
        isAvailable: newStatus,
      });
      if (response.data.success) {
        alert('Room status updated successfully!');
        const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
        setRooms(fetchResponse.data.rooms || fetchResponse.data);
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
        await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 1,
        });
      } else if (action === 'mark-unavailable') {
        await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 0,
        });
      } else if (action === 'cancel-reservation') {
        await axios.post('http://localhost/api/updateReservationStatus.php', {
          roomId,
          status: 'canceled',
        });
        await axios.post('http://localhost/api/updateRoomStatus.php', {
          roomId,
          isAvailable: 1,
        });
      }

      // Fetch updated rooms data
      const fetchResponse = await axios.get('http://localhost/api/getRooms1.php');
      setRooms(fetchResponse.data.rooms || fetchResponse.data);

      alert('Action completed successfully!');
    } catch (error) {
      console.error('Error handling action:', error);
      alert('Failed to perform the action');
    }
  };

  // Calculate the current requests and rooms to display
  const currentRequests = requests.slice(requestPage * itemsPerPage, (requestPage + 1) * itemsPerPage);
  const currentRooms = rooms.slice(roomPage * itemsPerPage, (roomPage + 1) * itemsPerPage);

  return (
    <div className="maintenance-requests-container">
      <h2>Maintenance Requests</h2>
      <div className="request-list">
        {Array.isArray(currentRequests) && currentRequests.length > 0 ? (
          currentRequests.map((request, index) => (
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
                    />
                    <input
                      type="date"
                      value={replyData.scheduledDate}
                      onChange={(e) => setReplyData({ ...replyData, scheduledDate: e.target.value })}
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

      {/* View More Button for Maintenance Requests */}
      {requests.length > (requestPage + 1) * itemsPerPage && (
        <button onClick={() => setRequestPage(requestPage + 1)}>View More Requests</button>
      )}

      <h2>Room Status</h2>
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
                <td>{room.id}</td>
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

      {/* View More Button for Room Status */}
      {rooms.length > (roomPage + 1) * itemsPerPage && (
        <button onClick={() => setRoomPage(roomPage + 1)}>View More Rooms</button>
      )}
    </div>
  );
};

export default MaintenanceRequests;