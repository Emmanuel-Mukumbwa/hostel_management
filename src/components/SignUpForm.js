import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Ensure this CSS file styles the form appropriately

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState(''); // New state for contact
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false); // New state to track successful sign-up

  // Validate password length
  const validatePasswordLength = (password) => {
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long');
    } else {
      setPasswordError('');
    }
  };

  // Check if the form is valid
  const checkFormValidity = useCallback(() => {
    if (username && email && password && contact && password.length >= 4) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [username, email, password, contact]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await axios.post('http://localhost/api/signup.php', {
          username,
          email,
          password,
          contact, // Include contact in the request
          role_id: 3 // Assuming '3' is the role ID for normal users
        }, {
          headers: {
            'Content-Type': 'application/json' // Specify the content type
          }
        });
        
        if (response.data.success) {
          setSignupMessage('Sign up successful! Please log in.');
          setIsSignUpSuccessful(true); // Set sign-up success state
        } else {
          setSignupMessage('Sign up failed: ' + response.data.message);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        setSignupMessage('An error occurred during sign up. Please try again.');
      }
    } else {
      setSignupMessage('Please fill in all fields correctly before submitting.');
    }
  };

  // Effect to check form validity whenever inputs change
  useEffect(() => {
    checkFormValidity();
  }, [checkFormValidity]);

  return (
    <Container className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={10} lg={8} xl={6} className="mx-auto"> {/* Increased column size for better space utilization */}
          <div className="login-box p-4 border rounded shadow">
            <h2 className="text-center">Sign Up</h2>
            <p className="text-center">@logohostel</p> {/* Added text here */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePasswordLength(e.target.value);
                  }} 
                  required
                />
                {passwordError && <Alert variant="danger" className="mt-2">{passwordError}</Alert>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Contact Number" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={!isFormValid} className="w-100">
                Sign Up
              </Button>
              {signupMessage && <Alert variant={isSignUpSuccessful ? "success" : "danger"} className="mt-3">{signupMessage}</Alert>}
            </Form>
            {/* Show Login button if sign up is successful */}
            {isSignUpSuccessful && (
              <Link to="/login">
                <Button variant="link" className="mt-3">Go to Login</Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="link" className="mt-2">Go to Home</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;