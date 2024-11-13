<?php
// getRooms1.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Fetch all rooms and their reservations from the database
$sql = "
    SELECT rooms.*, 
           room_reservations.reservation_id, 
           room_reservations.status AS reservation_status 
    FROM rooms 
    LEFT JOIN room_reservations 
    ON rooms.id = room_reservations.room_id 
    AND room_reservations.status IN ('active', 'pending');"; // Assuming 'active' and 'pending' are the statuses for ongoing reservations

$result = $conn->query($sql);

$rooms = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ensure is_available is properly cast to an integer before sending the response
        $row['is_available'] = (int)$row['is_available'];
        $row['reservation_status'] = $row['reservation_status'] ? $row['reservation_status'] : 'none'; // Default to 'none' if no reservation
        $rooms[] = $row;
    }
}

// Return the rooms as a JSON object
echo json_encode(['rooms' => $rooms]);

// Close the connection
$conn->close();
?>