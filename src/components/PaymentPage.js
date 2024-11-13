import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar2 from './Navbar2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const PaymentPage = () => {
  const location = useLocation();
  const { username, email, roomNumber, duration, totalPrice } = location.state || {};

  const [paymentProof, setPaymentProof] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !roomNumber || !duration || !totalPrice || !paymentProof) {
      setErrorMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('room_number', roomNumber);
    formData.append('duration', duration);
    formData.append('total_price', totalPrice);
    formData.append('payment_proof', paymentProof);

    try {
      const response = await axios.post('http://localhost/api/payment.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccessMessage('Your payment process was successful. Please wait for confirmation.');
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing your payment. Please try again.');
    }
  };

  return (
    <div className="payment-page-container">
      <Navbar2 />
      <Container className="my-5">
        <h1 className="text-center">Make Payment</h1>
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        {successMessage && <p className="text-success text-center">{successMessage}</p>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" value={username} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formRoomNumber">
                <Form.Label>Room Number:</Form.Label>
                <Form.Control type="text" value={roomNumber} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formDuration">
                <Form.Label>Duration (days):</Form.Label>
                <Form.Control type=" number" value={duration} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formTotalPrice">
                <Form.Label>Total Price (MK):</Form.Label>
                <Form.Control type="number" value={totalPrice} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPaymentProof">
                <Form.Label>Payment Proof (screenshot or deposit slip):</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">Submit Payment</Button>
        </Form>

        <footer className="footer text-center mt-4">
          <p>&copy; 2024 LOGO Hostel</p>
          <div className="social-media">
            <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
          </div>
        </footer>
      </Container>
    </div>
  );
};

export default PaymentPage;