<?php
// getMaintenanceAnalytics.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Query to get the counts of completed and pending maintenance requests
$sql = "
    SELECT 
        COUNT(*) AS total_requests,
        SUM(status = 'completed') AS completed_requests,
        SUM(status = 'pending') AS pending_requests
    FROM maintenance_requests;
";

$result = $conn->query($sql);
$analytics = $result->fetch_assoc();

echo json_encode($analytics);

// Close the connection
$conn->close();
?>