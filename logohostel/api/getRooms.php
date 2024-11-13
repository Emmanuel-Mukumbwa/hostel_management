<?php
// getRooms.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php'; // Include database connection

// Query to fetch room data with details from room_details
$sql = "SELECT r.id, r.name, r.is_available, r.room_number, rd.type, rd.price, rd.number_of_beds
        FROM rooms r
        JOIN room_details rd ON r.room_detail_id = rd.id"; // Join with room_details

$result = $conn->query($sql);

if ($result) {
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        // Map database fields to a JSON response
        $rooms[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'type' => $row['type'], // Include type from room_details
            'price' => $row['price'], // Include price from room_details
            'is_available' => (bool) $row['is_available'],  // Convert to boolean for consistency
            'room_number' => $row['room_number'], // Include room_number
            'number_of_beds' => $row['number_of_beds'] // Include number_of_beds from room_details
        ];
    }
    // Return room data as JSON
    echo json_encode($rooms);
} else {
    // Return error message if query fails
    echo json_encode(["message" => "Failed to fetch rooms"]);
}

// Close the database connection
$conn->close();
?>