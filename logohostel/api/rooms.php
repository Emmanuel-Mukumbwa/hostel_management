<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php'; // Include your db connection

// Fetch available rooms with their details
$sql = "SELECT r.id, rd.type, rd.price, r.is_available, r.room_number 
        FROM rooms r 
        JOIN room_details rd ON r.room_detail_id = rd.id 
        WHERE r.is_available = 1";
$result = $conn->query($sql);

$rooms = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $rooms[] = [
            'id' => $row['id'],
            'type' => $row['type'],
            'price' => $row['price'],
            'is_available' => $row['is_available'],
            'room_number' => $row['room_number']
        ];
    }
}

echo json_encode(['rooms' => $rooms]);
?>