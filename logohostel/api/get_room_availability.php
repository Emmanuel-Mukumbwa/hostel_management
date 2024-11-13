<?php
// get_room_availability.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

$room_id = $_GET['id'];
$check_in_date = $_GET['check_in_date'];
$check_out_date = $_GET['check_out_date'];

// Query to get booked beds
$query = "SELECT COUNT(*) as booked_beds FROM rooms WHERE id = ? AND (check_in_date < ? AND check_out_date > ?)";
$stmt = $conn-> prepare($query);
$stmt->bind_param("iss", $room_id, $check_out_date, $check_in_date);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode(['success' => true, 'booked_beds' => $data['booked_beds']]);
?>