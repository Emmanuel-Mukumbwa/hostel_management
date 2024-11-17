import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Button, Card, Row, Col, Container, Carousel } from 'react-bootstrap';
import { FaBook } from 'react-icons/fa'; // Importing an icon from react-icons
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Import custom CSS file

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [faqVisible, setFaqVisible] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    fetch('http//localhost/getRooms.php')
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setError(data.message);
        } else {
          setRooms(data);
        }
      })
      .catch(err => {
        setError('Failed to fetch rooms. Please try again later.');
      });
  }, []);

  const handleViewMore = () => {
    navigate('/login');
  };

  const handleBookNow = (roomId) => {
    if (!isLoggedIn || userRole === 'public') {
      navigate('/login');
    } else {
      console.log(`Proceed to book room with ID: ${roomId}`);
    }
  };

  return (
    <div className="homepage-container">
      <Navbar />
      <Container className="hero text-center my-5">
        <h1>Welcome to LOGO Hostel</h1>
        <p>Book a room, make payments, and report issues.</p>

        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Row className="mb-4">
            {rooms.length > 0 ? (
              <>
                {rooms.filter(room => room.is_available).slice(0, 6).map(room => (
                  <Col md={4} key={room.id} className="mb-4">
                    <Card className="room-card">
                      <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/room-placeholder.jpg`} />
                      <Card.Body>
                        <Card.Title>{room.name}</Card.Title>
                        <Card.Text>
                          <strong>Price:</strong> MK{room.price}<br />
                          <strong>Room Number:</strong> {room.room_number}<br />
                          <strong>Status:</strong> {room.is_available ? "Available" : "Not Available"}
                        </Card.Text>
                        {room.is_available && (
                          <Button variant="primary" onClick={() => handleBookNow(room.id)}>
                            <FaBook /> Book Now
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}

                {rooms.length > 6 && (
                  <Col className="text-center">
                    <Button variant="link" onClick={handleViewMore}>
                      View More Rooms
                    </Button>
                  </Col>
                )}
              </>
            ) : (
              <p>Loading rooms...</p>
            )}
          </Row>
        )}

        {/* Image Gallery */}
        <section className="image-gallery mb-5">
          <h2>Our Hostel and Rooms</h2>
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={`${process.env.PUBLIC_URL}/image1.jpeg`} alt="Hostel view" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={`${process.env.PUBLIC_URL}/image2.jpeg`} alt="Hostel view" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={`${process.env.PUBLIC_URL}/image3.jpeg`} alt="Room" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={`${process.env.PUBLIC_URL}/image 4.jpeg`} alt="Another Room" />
            </Carousel.Item>
          </Carousel>
        </section>

        {/* Location and Map Section */}
        <section className="map mb-5" id="map">
          <h2>Our Location</h2>
          <iframe
            title="hostel-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31513.13248267352!2d34.001041!3d-11.439194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x191c88d8094c7e4b%3A0xa62f9b7d391f5d9!2sMzuzu%20University!5e0!3m2!1sen!2smw!4v1618234785601!5m2!1sen!2smw"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
          <p>Just behind Mzuzu University ODEL campus</p>
        </section>

        {/* FAQ Section */}
        <section className={`faq ${faqVisible ? 'faq-visible' : ''}`} id="faq">
          <h2>Frequently Asked Questions</h2>
          <Button variant="outline-secondary" onClick={() => setFaqVisible(!faqVisible)}>
            {faqVisible ? 'Hide FAQs' : 'Show FAQs'}
          </Button>
          {faqVisible && (
            <div className="faq-container mt-3">
              <div className="faq-item">
                <h3>How do I book a room?</h3>
                <p>Click the "Book Now" button on any available room after logging in.</p>
              </div>
              <div className="faq-item">
                <h3>How do I report an issue?</h3>
                <p>Use the issue reporting feature after logging in.</p>
              </div>
              <div className="faq-item">
                <h3>How can I make payments?</h3>
                <p>Payments can be made on the payments page after logging in.</p>
              </div>
            </div>
          )}
        </section>

        {/* Footer Section */}
        <footer className="footer mt-5">
          <p>&copy; 2024 LOGO Hostel</p>
          <div className="social-media">
            <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
          </div>
        </footer>
      </Container>
    </div>
  );

};

export default HomePage;