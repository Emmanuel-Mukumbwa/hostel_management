<?php
// updateRoomStatus.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'db.php'; // Include your database connection

$data = json_decode(file_get_contents("php://input"));

if (isset($data->roomId) && isset($data->isAvailable)) {
    $roomId = $data->roomId;
    $isAvailable = $data->isAvailable;

    $stmt = $conn->prepare("UPDATE rooms SET is_available = ? WHERE id = ?");
    $stmt->bind_param("ii", $isAvailable, $roomId);
    $success = $stmt->execute();

    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
}

$conn->close();
?>