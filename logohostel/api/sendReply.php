<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'db.php'; // Include your database connection

$data = json_decode(file_get_contents("php://input"), true);

// Validate the incoming data
if (isset($data['requestId'], $data['message'], $data['scheduledDate'])) {
    $requestId = $data['requestId'];
    $message = $data['message'];
    $scheduledDate = $data['scheduledDate'];

    // Fetch the username associated with the requestId
    $sql = "SELECT username FROM maintenance_requests WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("i", $requestId);
    $stmt->execute();
    $result = $stmt->get_result();
    $username = $result->fetch_assoc()['username'] ?? null;
    $stmt->close();

    if ($username) {
        // Prepare the SQL statement to insert the reply
        $sql = "INSERT INTO maintenance_replies (request_id, message, scheduled_date, username) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            exit();
        }

        $stmt->bind_param("isss", $requestId, $message, $scheduledDate, $username);

        // Execute the statement and check for success
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Reply sent successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send reply: ' . $stmt->error]);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Request not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
}

// Close the database connection
$conn->close();
?>