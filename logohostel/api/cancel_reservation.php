<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Content-Type: application/json");

include 'db.php'; // Include your db connection

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));

    $roomId = $data->roomId;

    // Update the reservation status to 'canceled'
    $updateQuery = "UPDATE room_reservations SET status = 'c anceled' WHERE room_id = ? AND status = 'pending'";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param('i', $roomId);

    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Reservation canceled successfully.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error canceling reservation.']);
    }
}
?>