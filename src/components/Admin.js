import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Form, Alert } from 'react-bootstrap';
import Navbar4 from './Navbar4';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // Ensure this is initialized as an array
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalUsers, setTotalUsers] = useState(0); // State for total users

  // Fetch users from the API
  useEffect(() => {
    axios.get('http://localhost/api/getUsers.php', {
      params: {
        page: page,
        search: search
      }
    })
    .then(response => {
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users); // Access the users array
        setTotalUsers(response.data.total); // Access the total count
      } else {
        console.error('Expected users to be an array:', response.data.users);
        setUsers([]); // Reset to empty array if not an array
      }
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      setUsers([]); // Reset to empty array on error
    });
  }, [page, search]);

  // Fetch roles for dropdown
  useEffect(() => {
    axios.get('http://localhost/api/getRoles.php')
    .then(response => setRoles(response.data))
    .catch(error => console.error('Error fetching roles:', error));
  }, []);

  // Handle role change
  const handleRoleChange = (userId, roleId) => {
    axios.post('http://localhost/api/updateUser Role.php', { userId, roleId })
    .then(response => {
      if (response.data.success) {
        alert('User  role updated successfully!');
        fetchUsers(); // Reload users to reflect the role change
      } else {
        alert('Failed to update user role');
      }
    })
    .catch(error => console.error('Error updating user role:', error));
  };

  // Fetch users again to refresh the list
  const fetchUsers = () => {
    axios.get('http://localhost/api/getUsers.php', { params: { page, search } })
      .then(response => {
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
          setTotalUsers(response.data.total);
        }
      });
  };

  // Handle user removal
  const handleUserRemoval = (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      axios.post('http://localhost/api/removeUser .php', { userId })
      .then(response => {
        if (response.data.success) {
          alert('User  removed successfully!');
          fetchUsers(); // Refresh the user list after removal
        } else {
          alert('Failed to remove user');
        }
      })
      .catch(error => console.error('Error removing user:', error));
    }
  };

  return (
    <Container>
      <h1 className="mt-4">Admin Dashboard</h1>
      <hr />

      {/* Analytics Section */}
      <h2>Overview</h2>
      <div className="analytics-section mb-4">
        <div className="analytics-card p-3 border rounded">
          <h3>Total Users: {totalUsers}</h3>
        </div>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Remove User</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.role_name}</td>
                <td>
                  <Form.Select
                    value={user.role_id || ''}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="" disabled>Change Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role_name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleUserRemoval(user.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="pagination mb-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <span className="mx-2">Page {page}</span>
        <Button onClick={() => setPage(page + 1)} disabled={users.length < 10}>Next</Button>
      </div>

      <Navbar4 />

      {/* Footer Section */}
      <footer className="footer text-center mt-4">
        <p>&copy; 2024 LOGO Hostel</p>
        <div className="social-media">
          <a href="#facebook">Facebook</a> | <a href="#twitter">Twitter</a>
        </div>
      </footer>
    </Container>
  );
};

export default AdminDashboard;