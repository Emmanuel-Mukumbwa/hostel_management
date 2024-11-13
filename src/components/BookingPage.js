import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
//import './BookingPage.css';
import './HomePage.css'
import Navbar2 from './Navbar2';

const BookingPage = () => {
  const [roomId, setRoomId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [duration, setDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', contact: '' });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [error, setError] = useState('');
  const [isReserved, setIsReserved] = useState(false);
  const [reservationMessage, setReservationMessage] = useState('');
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomAvailabilityMessage, setRoomAvailabilityMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const name = localStorage.getItem('userName') || '';
    const email = localStorage.getItem('userEmail') || '';
    const contact = localStorage.getItem('userContact') || '';
    setUserInfo({ name, email, contact });

    // Load reservation details from local storage
    const reservation = JSON.parse(localStorage.getItem('reservation'));
    if (reservation) {
      setReservationDetails(reservation);
      setIsReserved(true);
      setRoomId(reservation.roomId);
      setCheckInDate(reservation.checkInDate);
      setCheckOutDate(reservation.checkOutDate);
      setDuration(reservation.duration);
      setTotalPrice(reservation.totalPrice);
      setDiscount(reservation.discount || 0);
    }

    axios.get(`http://localhost/api/loyalty_discount.php?username=${name}`)
      .then(response => {
        if (response.data.success) {
          setLoyaltyDiscount(response.data.loyalty_discount);
        }
      })
      .catch(() => setError('Error fetching loyalty discount'));

    const room = location.state?.room;
    if (room) {
      setRoomId(room.id);
    }
  }, [location.state]);

  useEffect(() => {
    axios.get('http://localhost/api/rooms.php')
      .then(response => {
        setAvailableRooms(response.data.rooms);
      })
      .catch(() => setError('Error fetching rooms'));
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate && roomId) {
      const durationInDays = calculateDuration(checkInDate, checkOutDate);
      setDuration(durationInDays);

      const selectedRoom = availableRooms.find(room => room.id === roomId);
      if (selectedRoom) {
        const pricePerMonth = selectedRoom.type === 'single' ? 45000 : 35000;
        const pricePerDay = pricePerMonth / 30;
        const price = pricePerDay * durationInDays;
        setTotalPrice(price);

        axios.get(`http://localhost/api/get_room_availability.php?room_id=${roomId}&check_in_date=${checkInDate}&check_out_date=${checkOutDate}`)
          .then(response => {
            if (response.data.success) {
              const bookedBeds = response.data.booked_beds;
              if (selectedRoom.type === 'double') {
                if (bookedBeds === 0) {
                  setRoomAvailabilityMessage(`All beds are available for Room Number ${selectedRoom.room_number}.`);
                } else if (bookedBeds === 1) {
                  setRoomAvailabilityMessage(`One bed is booked for Room Number ${selectedRoom.room_number}. One bed is available.`);
                } else {
                  setRoomAvailabilityMessage(`All beds are booked for Room Number ${selectedRoom.room_number}.`);
                  setIsReserved(true); // Prevent booking
                }
              } else {
                setRoomAvailabilityMessage(`The bed is ${bookedBeds === 0 ? 'available' : 'booked'} for Room Number ${selectedRoom.room_number}.`);
              }
            } else {
              setError(response.data.error);
            }
          })
          .catch(() => setError('Error fetching room availability'));
      }
    
  }}, [checkInDate, checkOutDate, roomId, availableRooms, loyaltyDiscount]);

  useEffect(() => {
    if (isReserved && reservationDetails) {
      setCheckingPayment(true);
      const intervalId = setInterval(() => {
        axios.get(`http://localhost/api/check_payment_status.php?username=${userInfo.name}&email=${userInfo.email}&room_number=${reservationDetails.roomId}`)
          .then(response => {
            if (response.data.success) {
              setPaymentStatus(response.data.status);
              if (response.data.status === 'confirmed') {
                clearInterval(intervalId);
                setCheckingPayment(false);
                setReservationMessage(`Room booked successfully. Your payment has been confirmed.`);
              }
            } else {
              setError(response.data.error);
            }
          })
          .catch(() => setError('Error checking payment status'));
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isReserved, userInfo, reservationDetails]);

  const calculateDuration = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(checkInDate) > new Date(checkOutDate)) {
      setError('Check-out date must be later than check-in date');
      return;
    }

    if (isReserved) {
      setError('Booking is not allowed as all beds are reserved.');
      return;
    }

    const durationInDays = calculateDuration(checkInDate, checkOutDate);
    let calculatedDiscount = 0;

    if (durationInDays > 90) {
      calculatedDiscount = totalPrice * 0.1; // Example: 10% discount for more than 90 days
    }

    const finalTotalPrice = totalPrice - calculatedDiscount;

    axios.post('http://localhost/api/booking.php', {
      roomId,
      checkInDate,
      checkOutDate,
      duration: durationInDays,
      totalPrice: finalTotalPrice,
      userInfo,
      discount: calculatedDiscount
    })
      .then(() => {
        setIsReserved(true);
        setDiscount(calculatedDiscount);
        setReservationMessage(`Room reserved successfully. A discount of MK${calculatedDiscount.toFixed(2)} has been applied.`);
        setReservationDetails({
          roomId,
          checkInDate,
          checkOutDate,
          duration: durationInDays,
          totalPrice: finalTotalPrice,
          discount: calculatedDiscount
        });
        localStorage.setItem('reservation', JSON.stringify({
          roomId,
          checkInDate,
          checkOutDate,
          duration: durationInDays,
          totalPrice: finalTotalPrice,
          discount: calculatedDiscount
        }));

        setAvailableRooms(prevRooms => prevRooms.map(room =>
          room.id === roomId ? { ...room, is_available: 0 } : room
        ));

        axios.put(`http://localhost/api/updateRoomStatus.php`, {
          roomId,
          isAvailable: 0
        })
          .then(response => {
            if (response.data.success) {
              console.log(response.data.message);
            } else {
              console.error(response.data.error);
            }
          })
          .catch(() => setError('Error updating room status'));
      })
      .catch(() => setError('Error during booking. Please try again.'));
  };

  const handleCancelReservation = () => {
    axios.put(`http://localhost/api/cancel_reservation.php`, {
      roomId: reservationDetails.roomId,
    })
      .then(response => {
        if (response.data.success) {
          return axios.put(`http://localhost/api/updateRoomStatus.php`, {
            roomId: reservationDetails.roomId,
            isAvailable: 1
          });
        } else {
          setError(response.data.error);
        }
      })
      .then(response => {
        if (response && response.data.success) {
          setIsReserved(false);
          setReservationDetails(null);
          localStorage.removeItem('reservation');
          alert('Reservation canceled successfully.');
        } else if (response) {
          setError(response.data.error);
        }
      })
      .catch(() => setError('Error canceling reservation. Please try again.'));
  };

  const handleCheckout = () => {
    axios.put(`http://localhost/api/checkout.php`, {
      roomId: reservationDetails.roomId,
    })
      .then(response => {
        if (response.data.success) {setIsReserved(false);
          setReservationDetails(null);
          localStorage.removeItem('reservation');
          alert(response.data.message);
        } else {
          setError(response.data.error);
        }
      })
      .catch(() => setError('Error checking out. Please try again.'));
  };

  return (
    <div className="container booking-page-container">
      <Navbar2 />
      <h1 className="mt-4">Book a Room</h1>
      {error && <p className="text-danger">{error}</p>}
      <div className="form-group">
        <label>Room Type:</label>
        <select className="form-control" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">Select a room</option>
          {availableRooms.filter(room => room.is_available).map(room => (
            <option key={room.id} value={room.id}>
              {`Room Number ${room.room_number} - ${room.type} (MK${room.type === 'single' ? 45000 : 35000}/month)`}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Check-in Date:</label>
        <input type="date" className="form-control" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Check-out Date:</label>
        <input type="date" className="form-control" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
      </div>
      {roomId && availableRooms.find(room => room.id === roomId)?.type === 'double' && (
        <div>
          {roomAvailabilityMessage && (
            <p className="text-success">{roomAvailabilityMessage}</p>
          )}
        </div>
      )}
      <div>
        <h3>User Information</h3>
        <p>Name: {userInfo.name}</p>
        <p>Email: {userInfo.email}</p>
        <p>Contact: {userInfo.contact}</p>
      </div>
      <div>
        <h3>Booking Duration: {duration} days</h3>
        <h3>Total Price: MK{(totalPrice - discount).toFixed(2)}</h3>
        {discount > 0 && (
          <p className="text-success">You have a discount of MK{discount.toFixed(2)}!</p>
        )}
        {isReserved && (
          <p className="text-success">{reservationMessage}</p>
        )}
      </div>
      {isReserved && (
        <div>
          <p>Room Number: {reservationDetails.roomId}</p>
          <p>Check-in Date: {reservationDetails.checkInDate}</p>
          <p>Check-out Date: {reservationDetails.checkOutDate}</p>
          <p>Duration: {reservationDetails.duration} days</p>
          <p>Total Price: MK{(reservationDetails.totalPrice - reservationDetails.discount).toFixed(2)}</p>
          {checkingPayment && (
            <p>Checking payment status...</p>
          )}
          {paymentStatus === 'confirmed' && (
            <p className="text-success">Payment confirmed!</p>
          )}
          {paymentStatus === 'pending' && (
            <p className="text-warning">Payment pending...</p>
          )}
          <button className="btn btn-primary" onClick={() => navigate('/payments', {
            state: {
              username: userInfo.name,
              email: userInfo.email,
              roomNumber: reservationDetails.roomId,
              duration: reservationDetails.duration,
              totalPrice: reservationDetails.totalPrice - reservationDetails.discount,
            }
          })}>
            Continue to Payment
          </button>
          <button className="btn btn-danger" onClick={handleCancelReservation}>{paymentStatus === 'confirmed' ? 'Checkout' : 'Cancel Reservation'}</button>
        </div>
      )}
      {!isReserved && (
        <div>
          <button className="btn btn-success" onClick={handleBooking} disabled={isReserved}>
            Reserve Room
          </button>
        </div>
      )}
      <footer className="footer mt-4">
        <p>&copy; 2024 LOGO Hostel</p>
        <div className="social-media">
          <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;