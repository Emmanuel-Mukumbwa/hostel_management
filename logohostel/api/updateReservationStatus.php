<?php
// updateReservationStatus.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'db.php'; // Include your database connection

$data = json_decode(file_get_contents("php://input"));

if (isset($data->roomId) && isset($data->status)) {
    $roomId = $data->roomId;
    $status = $data->status;

    // Update the reservation status in the room_reservations table
    $stmt = $conn->prepare("UPDATE room_reservations SET status = ? WHERE room_id = ? AND status IN ('active', 'pending')");
    $stmt->bind_param("si", $status, $roomId);
    $success = $stmt->execute();

    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>