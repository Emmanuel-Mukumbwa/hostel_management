<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection

$data = json_decode(file_get_contents("php://input"), true);
$request_id = $data['request_id'];

// Prepare the SQL statement to update the status
$sql = "UPDATE maintenance_requests SET status = 'completed' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $request_id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Maintenance request marked as completed.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update the request.']);
}

// Close the connection
$stmt->close();
$conn->close();
?>