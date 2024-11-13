import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import Navbar2 from "./Navbar2";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaBook } from 'react-icons/fa'; // Importing the book icon

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [visibleRooms, setVisibleRooms] = useState(9);
  const navigate = useNavigate();
  const observer = useRef();

  const fetchRooms = () => {
    setLoading(true);
    axios.get('http://localhost/api/getRooms.php')
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch room data.');
        setLoading(false);
      });
  };

  const filteredRooms = rooms.filter(room => {
    if (filterPrice && room.price > filterPrice) return false;
    if (filterType && room.type !== filterType) return false;
    if (filterAvailability && room.is_available !== (filterAvailability === 'Available')) return false;
    return true;
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBookRoom = (room) => {
    navigate('/bookings', { state: { room } });
  };

  const lastRoomElementRef = useRef();
  useEffect(() => {
    if (loading) return;
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setVisibleRooms(prev => Math.min(prev + 9, filteredRooms.length));
      }
    };

    observer.current = new IntersectionObserver(observerCallback);
    if (lastRoomElementRef.current) {
      observer.current.observe(lastRoomElementRef.current);
    }

    return () => {
      if (lastRoomElementRef.current) {
        observer.current.unobserve(lastRoomElementRef.current);
      }
    };
  }, [loading, filteredRooms]);

  return (
    <div className="rooms-page">
      <Navbar2 />
      <Container className="my-5">
        <h2 className="text-center my-4">Rooms</h2>
        {loading ? (
          <p className="text-center">Loading rooms...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <div>
            <div className="filter-options mb-4">
              <Row>
                <Col md={4}>
                  <label>Filter by Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={filterPrice}
                    onChange={e => setFilterPrice(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <label>Filter by Type:</label>
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                  </select>
                </Col>
                <Col md={4}>
                  <label>Filter by Availability:</label>
                  <select
                    className="form-select"
                    value={filterAvailability}
                    onChange={e => setFilterAvailability(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                  </select>
                </Col>
              </Row>
            </div>
            <Row>
              {filteredRooms.length > 0 ? (
                filteredRooms.slice(0, visibleRooms).map((room, index) => (
                  <Col key={room.id} md={4} className="mb-4" ref={index === visibleRooms - 1 ? lastRoomElementRef : null}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{room.name} ({room.type})</Card.Title>
                        <Card.Text>
                          <strong>Price:</strong> MK{room.price}<br />
                          <strong>Status:</strong> {room.is_available ? 'Available' : 'Booked'}
                        </Card.Text>
                        {room.is_available ? (
                          <Button variant="primary" onClick={() => handleBookRoom(room)}>
                            <FaBook /> Book Now
                          </Button>
                        ) : (
                          <p className="text-muted">Room is booked.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center">No rooms available.</p>
              )}
            </Row>
          </div>
        )}
      </Container>
      <footer className="footer text-center mt-4">
        <p>&copy; 2024 LOGO Hostel</p>
        <div className="social-media">
          <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default RoomsPage;