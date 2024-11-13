<?php
// get_room_availability.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Get the username from the query string
$username = isset($_GET['username']) ? $conn->real_escape_string($_GET['username']) : '';

// Prepare the SQL statement to fetch reservations for the user
$sql = "SELECT r.id AS roomId, r.room_number, b.check_in_date AS checkInDate, b.check_out_date AS checkOutDate, 
               DATEDIFF(b.check_out_date, b.check_in_date) AS duration, b.total_price AS totalPrice, 
               b.discount AS discount
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.username = '$username' AND b.is_reserved = 1"; // Assuming there's a field to indicate if the reservation is active

// Execute the query
$result = $conn->query($sql);

// Check if any reservation was found
if ($result->num_rows > 0) {
    $reservation = $result->fetch_assoc();
    echo json_encode(['success' => true, 'reservation' => $reservation]);
} else {
    echo json_encode(['success' => false, 'error' => 'No reservations found for this user.']);
}

// Close the database connection
$conn->close();
?>