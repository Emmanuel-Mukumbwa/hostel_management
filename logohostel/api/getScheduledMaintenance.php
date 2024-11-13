<?php
// getScheduledMaintenance.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection

// Get the username from the request (you can pass it as a query parameter)
$username = isset($_GET['username']) ? $_GET['username'] : '';

// Fetch scheduled maintenance from the database, joining with the requests table
$sql = "
    SELECT mr.*, m.room_id 
    FROM maintenance_replies mr
    JOIN maintenance_requests m ON mr.request_id = m.id
    WHERE m.username = ?  -- Filter by username
    ORDER BY mr.scheduled_date ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username); // Bind the username parameter
$stmt->execute();
$result = $stmt->get_result();

$scheduledMaintenance = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        
        $scheduledMaintenance[] = [
            'id' => $row['id'],
            'request_id' => $row['request_id'],
            'message' => $row['message'],
            'scheduled_date' => $row['scheduled_date'],
            'room_number' => $row['room_id'], // Use room_id from maintenance_requests
            'created_at' => $row['created_at']
        ];
    }
}

// Return the scheduled maintenance data as JSON
echo json_encode(['scheduledMaintenance' => $scheduledMaintenance]);

// Close the database connection
$conn->close();
?>