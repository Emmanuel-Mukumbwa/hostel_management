<?php
//getRoomAnalytics.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Query to get the room analytics
$sql = "
    SELECT 
        COUNT(*) AS total_rooms,
        SUM(is_available = 1) AS available_rooms,
        SUM(is_available = 0) AS unavailable_rooms,
        (SELECT COUNT(*) FROM room_reservations WHERE status IN ('active', 'pending')) AS reserved_rooms
    FROM rooms;
";

$result = $conn->query($sql);
$analytics = $result->fetch_assoc();

echo json_encode($analytics);

// Close the connection
$conn->close();
?>