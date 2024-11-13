<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection

// Handle POST request to create a new maintenance request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the input data
    $data = json_decode(file_get_contents("php://input"), true);

    $username = $data['username'];
    $category = $data['category'];
    $description = $data['description'];
    $room_number = $data['room'];

    // Validate input data
    if (empty($username) || empty($category) || empty($description) || empty($room_number)) {
        echo json_encode(['success' => false, 'message' => 'Incomplete data provided']);
        exit;
    }

    // Prepare an SQL statement to get the room_id based on the room number
    $roomQuery = "SELECT id FROM rooms WHERE room_number = ?";
    $roomStmt = $conn->prepare($roomQuery);
    $roomStmt->bind_param('s', $room_number);
    $roomStmt->execute();
    $roomResult = $roomStmt->get_result();

    if ($roomRow = $roomResult->fetch_assoc()) {
        $roomId = $roomRow['id'];

        // Prepare an SQL statement to insert the maintenance request
        $sql = "INSERT INTO maintenance_requests (username, category, description, room_id, status) VALUES (?, ?, ?, ?, 'pending')";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $username, $category, $description, $roomId);

        if ($stmt->execute()) {
            // Return the ID of the newly created request
            echo json_encode(['success' => true, 'message' => 'Maintenance request submitted successfully.', 'request_id' => $stmt->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to submit maintenance request.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Room not found.']);
    }

    $roomStmt->close();
    exit; // Exit after handling POST request
}

// Handle GET request to fetch maintenance requests based on the username
$username = isset($_GET['username']) ? $_GET['username'] : '';

$sql = "SELECT r.room_number, m.* FROM maintenance_requests m 
        JOIN rooms r ON m.room_id = r.id 
        WHERE m.username = ?"; // Filter by username
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

$requests = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
}

// Return the requests as JSON
echo json_encode(['requests' => $requests]);

// Close the connection
$conn->close();
?>