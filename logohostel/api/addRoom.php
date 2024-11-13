<?php
// addRoom.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate the input data
    if (isset($data['name'], $data['type'], $data['isAvailable'], $data['room_number'])) {
        $name = $data['name'];
        $type_id = $data['type']; // Use type_id from room_details
        $isAvailable = $data['isAvailable'];
        $room_number = $data['room_number']; // Get the room number

        // Prepare the SQL statement
        $stmt = $conn->prepare("INSERT INTO rooms (name, room_number, is_available, room_detail_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssii", $name, $room_number, $isAvailable, $type_id); // Bind parameters

        // Execute the statement and check for success
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add room']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close the connection
$conn->close();
?>