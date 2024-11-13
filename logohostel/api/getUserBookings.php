<?php
// Enable CORS and set response headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


include 'db.php'; // Include your database connection

// Get the student_id from the query string
$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : null;

if ($student_id) {
    // Query to get the rooms booked by the student
    $query = "SELECT rooms.id, rooms.name, rooms.type, rooms.price
              FROM bookings
              JOIN rooms ON bookings.room_id = rooms.id
              WHERE bookings.student_id = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("i", $student_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $bookedRooms = [];

        while ($row = $result->fetch_assoc()) {
            $bookedRooms[] = $row;
        }

        echo json_encode($bookedRooms);
    } else {
        // Error preparing query
        echo json_encode(["message" => "Database query error."]);
    }
} else {
    echo json_encode(["message" => "Invalid student ID provided"]);
}

$conn->close();
?>
