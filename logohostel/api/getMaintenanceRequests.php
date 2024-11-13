<?php
// getMaintenanceRequests.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Fetch all maintenance requests from the database along with the username
$sql = "SELECT mr.*, u.username FROM maintenance_requests mr JOIN users u ON mr.username = u.username ORDER BY mr.created_at DESC";
$result = $conn->query($sql);

$requests = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    echo json_encode(['success' => true, 'requests' => $requests]);
} else {
    echo json_encode(['success' => false, 'message' => 'No maintenance requests found.']);
}

// Close the connection
$conn->close();
?>