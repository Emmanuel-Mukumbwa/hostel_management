import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css'; // Import the CSS file

function Login({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate(); // useNavigate for redirection

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://localhost/api/getUserRole.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${username}&password=${password}`
    })
      .then(response => response.json())
      .then(data => {
        console.log('Received data from server:', data); // Log the entire response

        if (data.role) {
          // Store role, email, and contact locally
          localStorage.setItem('userRole', data.role);
          localStorage.setItem('userName', username);
          localStorage.setItem('userEmail', data.email); // Store email
          localStorage.setItem('userContact', data.contact); // Store contact
          setRole(data.role); // Update state with the fetched role

          // Perform role-based redirection
          if (data.role === 'Admin' || data.role === 'Admin User' || data.role === 'landlord') {
            navigate('/admin');  // Redirect to admin page
          } else if (data.role === 'normal' || data.role === 'normal User') {
            navigate('/homepage1');  // Redirect to homepage for normal users
          } else if (data.role === 'landlord' || data.role === 'Landlord') {
            navigate('/landlord');  // Redirect to landlord page
          } else {
            navigate('/');  // Redirect to home for any other role
          }
        } else {
          setLoginMessage('Invalid login credentials');
        }
      })
      .catch(err => {
        console.error('Error logging in:', err);
        setLoginMessage('An error occurred. Please try again.');
      });
  };

  // Function to handle navigation to the signup page
  const handleSignup = () => {
    navigate('/signup'); // Adjust the path to your signup page
  };

  return (
    <Container className="login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={10} lg={8} xl={6} className="mx-auto"> {/* Increased column size for better space utilization */}
          <div className="login-box p-4 border rounded shadow">
            <h2 className="text-center">Login</h2>
            <p className="text-center">@logohostel</p> {/* Added text here */}
            {loginMessage && <Alert variant="danger" className="mt-3">{loginMessage}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Button variant="link" onClick={handleSignup}>
                Sign Up
              </Button>
              <Link to="/">
                <Button variant="link">Go to Home</Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;