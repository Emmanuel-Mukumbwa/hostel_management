import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar2 from './Navbar2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const MaintenancePage = () => {
    const [category, setCategory] = useState('');
    const [room, setRoom] = useState('');
    const [description, setDescription] = useState('');
    const [requestTracking, setRequestTracking] = useState([]);
    const [scheduledMaintenance, setScheduledMaintenance] = useState([]);
    const [reportMessage, setReportMessage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('userName');
        if (username) {
            axios
                .get(`http://localhost/api/maintenance.php?username=${username}`)
                .then((response) => {
                    if (response.data.requests) {
                        setRequestTracking(response.data.requests);
                    } else {
                        setRequestTracking([]);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching maintenance requests:', error);
                });
        }

        const reservation = JSON.parse(localStorage.getItem('reservation'));
        if (reservation) {
            setRoom(reservation.roomId);
        }
    }, []);

    useEffect(() => {
        const username = localStorage.getItem('userName');
        if (username) {
            axios
                .get(`http://localhost/api/getScheduledMaintenance.php?username=${username}`)
                .then((response) => {
                    if (response.data.scheduledMaintenance) {
                        setScheduledMaintenance(response.data.scheduledMaintenance);
                    } else {
                        setScheduledMaintenance([]);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching scheduled maintenance:', error);
                });
        }
    }, []);

    const handleReport = () => {
        const username = localStorage.getItem('userName');
        if (category && room && description) {
            axios
                .post(
                    'http://localhost/api/maintenance.php',
                    JSON.stringify({
                        username,
                        category,
                        room,
                        description,
                    }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                .then((response) => {
                    console.log('Response from server:', response.data);
                    setReportMessage(response.data.message);
                    if (response.data.request_id) {
                        setRequestTracking((prevRequests) => [
                            ...prevRequests,
                            {
                                id: response.data.request_id,
                                category,
                                room,
                                description,
                                status: 'pending',
                            },
                        ]);
                    }
                })
                .catch((error) => {
                    console.error('Error submitting request:', error);
                    setReportMessage('Issue reporting failed.');
                });
        } else {
            setReportMessage('Please fill in the category, room, and description.');
        }
    };

    const updateStatus = (request_id, newStatus) => {
        axios
            .post(
                'http://localhost/api/updateMaintenanceStatus.php',
                JSON.stringify({ request_id, status: newStatus }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            .then((response) => {
                if (response.data.success) {
                    const updatedRequests = requestTracking.map((request) =>
                        request.id === request_id ? { ...request, status: newStatus } : request
                    );
                    setRequestTracking(updatedRequests);
                    setStatus(''); // Reset status input after update
                } else {
                    console.error('Failed to update status:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };

    const toggleDetails = (index) => {
        const element = document.getElementById(`details-${index}`);
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    };

    return (
        <div className="maintenance-container">
            <Navbar2 />
            <Container className="my-5">
                <h1>Maintenance Request</h1>

                <div className="report-form mb-4">
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select a category</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Carpentry">Carpentry</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formRoomNumber">
                                <Form.Label>Room Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter room number"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    disabled={room !== ''}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Describe the issue"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button onClick={handleReport} disabled={!category || !room || !description}>
                        Submit
                    </Button>
                    {reportMessage && <p className="report-message">{reportMessage}</p>}
                </div>

                <hr />

                <h2>Request Tracking</h2>
                <div className="request-tracking-container">
                    {requestTracking.length > 0 ? (
                        requestTracking.map((request, index) => (
                            <div key={index} className="request-card mb-3">
                                <div className="request-header" onClick={() => toggleDetails(index)}>
                                    {request.category}
                                    <span> ▼</span>
                                </div>
                                <div id={`details-${index}`} className="request-details" style={{ display: 'none' }}>
                                    <p>{request.description}</p>
                                    <p>Status: {request.status}</p>
                                    <p>Room Number: {request.room_number}</p>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Update Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </Form.Control>
                                    <Button onClick={() => updateStatus(request.id, status)}>
                                        Update Status
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No maintenance requests found.</p>
                    )}
                </div>

                <hr />

                <h2>Scheduled Maintenance</h2>
                <ul className="scheduled-maintenance-list">
                    {scheduledMaintenance.length > 0 ? (
                        scheduledMaintenance.map((maintenance) => (
                            <li key={maintenance.id}>
                                <span className="maintenance-date">{maintenance.scheduled_date}</span>
                                <p className="maintenance-description">
                                    {maintenance.message} (Room {maintenance.room_number})
                                </p>
                            </li>
                        ))
                    ) : (
                        <p>No scheduled maintenance found.</p>
                    )}
                </ul>

                <hr />

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

export default MaintenancePage;