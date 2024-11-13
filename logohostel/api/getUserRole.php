<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
include 'db.php'; // Include your db connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Query to fetch user role, email, contact, and hashed password based on username
    $query = "SELECT r.role_name, u.email, u.contact, u.password 
              FROM users u 
              JOIN roles r ON u.role_id = r.id 
              WHERE u.username = ? 
              LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        
        // Verify the password
        if (password_verify($password, $row['password'])) {
            // Prepare the response with role, email, and contact
            $response = array(
                'role' => $row['role_name'],
                'email' => $row['email'],
                'contact' => $row['contact']
            );
            echo json_encode($response);
        } else {
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } else {
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
?>