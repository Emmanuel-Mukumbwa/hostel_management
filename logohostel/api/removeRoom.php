<?php
//removeUser.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
include 'db.php'; // Include your db connection


// Get the room number from the request
$data = json_decode(file_get_contents("php://input"), true);
$roomNumber = isset($data['roomNumber']) ? $data['roomNumber'] : null;

if ($roomNumber) {
    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("DELETE FROM rooms WHERE room_number = ?");
    $stmt->bind_param("s", $roomNumber); // Assuming room_number is a string

    // Execute the statement
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Room was successfully deleted
            echo json_encode(['success' => true, 'message' => 'Room removed successfully.']);
        } else {
            // No room was found with that room number
            echo json_encode(['success' => false, 'message' => 'No room found with that room number.']);
        }
    } else {
        // Error executing the statement
        echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $stmt->error]);
    }

    // Close the statement
    $stmt->close();
} else {
    // Invalid room number
    echo json_encode(['success' => false, 'message' => 'Invalid room number.']);
}

// Close the database connection
$conn->close();
?>