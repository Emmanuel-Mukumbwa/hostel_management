<?php
//removeUser.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
include 'db.php'; // Include your db connection


// Get the user ID from the request
$data = json_decode(file_get_contents("php://input"), true);
$userId = isset($data['userId']) ? intval($data['userId']) : 0;

if ($userId > 0) {
    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);

    // Execute the statement
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // User was successfully deleted
            echo json_encode(['success' => true, 'message' => 'User  removed successfully.']);
        } else {
            // No user was found with that ID
            echo json_encode(['success' => false, 'message' => 'No user found with that ID.']);
        }
    } else {
        // Error executing the statement
        echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $stmt->error]);
    }

    // Close the statement
    $stmt->close();
} else {
    // Invalid user ID
    echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
}

// Close the database connection
$conn->close();
?>