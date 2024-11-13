<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php'; // Include your db connection

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $roomId = $_GET['roomId'];

    // Query to get the reservations for the double room
    $query = "SELECT * FROM room_reservations WHERE room_id = ? AND status = 'pending'";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('i', $roomId);
    $stmt->execute();
    $result = $stmt->get_result();

    $reservations = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $reservations[] = $row;
        }
    }

    echo json_encode(['reservations' => $reservations]);
}
?>