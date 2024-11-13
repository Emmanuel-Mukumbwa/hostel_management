<?php
// getUser Reservations.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // Include your database connection

// Retrieve the user ID from the request
$userId = isset($_GET['userId']) ? $_GET['userId'] : ''; // Check if userId is set

if ($userId) {
    // Prepare the SQL statement to prevent SQL injection
    $sql = "SELECT * FROM room_reservations WHERE user_id = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("s", $userId); // Bind the userId parameter
        $stmt->execute();
        $result = $stmt->get_result();

        $reservations = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $reservations[] = $row;
            }
        }

        // Return the reservations as a JSON object
        echo json_encode(['reservations' => $reservations]);
    } else {
        // Handle SQL statement preparation error
        echo json_encode(['error' => 'Failed to prepare SQL statement.']);
    }

    // Close the statement
    $stmt->close();
} else {
    // Return an error if userId is not provided
    echo json_encode(['error' => 'User  ID is required.']);
}

// Close the database connection
$conn->close();
?>