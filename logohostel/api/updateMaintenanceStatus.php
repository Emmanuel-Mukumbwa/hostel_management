<?php
// updateMaintenanceStatus.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection

// Get the request body
$data = json_decode(file_get_contents("php://input"), true);
$request_id = $data['request_id'];
$status = $data['status'];

// Prepare the SQL statement to update the status
$sql = "UPDATE maintenance_requests SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $request_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Status updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update status.']);
}

// Close the connection
$stmt->close();
$conn->close();
?>
