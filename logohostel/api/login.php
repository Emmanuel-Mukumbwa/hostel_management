<?php
include 'db.php';  // Include database connection

// Get the login data
$email = $_POST['email'];
$password = $_POST['password'];

// Query to check if the user exists
$sql = "SELECT u.id, u.password, r.role_name FROM users u
        JOIN roles r ON u.role_id = r.id 
        WHERE u.username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Check if password matches (in production, use password_hash and password_verify)
    if ($password === $user['password']) {
        // Return role and success status
        echo json_encode([
            'status' => 'success',
            'role' => $user['role_name']
        ]);
    } else {
        // Incorrect password
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
} else {
    // User not found
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

$stmt->close();
$conn->close();
?>
