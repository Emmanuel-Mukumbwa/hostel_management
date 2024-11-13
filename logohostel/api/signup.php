<?php
//signup.php

// Enable CORS and set response headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Include your database connection
include 'db.php'; // Ensure your db.php file connects to the database

// Check the request method
// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (isset($input['username']) && isset($input['email']) && isset($input['password']) && isset($input['contact']) && isset($input['role_id'])) {
        $username = $input['username'];
        $email = $input['email'];
        $password = password_hash($input['password'], PASSWORD_BCRYPT); // Hash the password
        $contact = $input['contact']; // Get the contact number
        $role_id = $input['role_id'];

        // Prepare an SQL statement to insert the new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password, contact, role_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $username, $email, $password, $contact, $role_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User  registered successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
}
?>