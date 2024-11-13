<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    // Extract data from the JSON input
    $roomId = $data->roomId;
    $checkInDate = $data->checkInDate;
    $checkOutDate = $data->checkOutDate;
    $duration = $data->duration; // Not used in the insert, but could be used for validation or calculations
    $totalPrice = $data->totalPrice; // Not used in the insert, but could be stored if needed
    $userInfo = $data->userInfo;

    $username = $userInfo->name; // Use username for booking

    // Query to get user ID based on username
    $query = "SELECT id FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userRow = $result->fetch_assoc();
        $userId = $userRow['id'];

        // Insert reservation
        $insertQuery = "INSERT INTO room_reservations (room_id, user_id, check_in_date, check_out_date, status) 
                        VALUES (?, ?, ?, ?, 'pending')";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param('iiss', $roomId, $userId, $checkInDate, $checkOutDate);

        if ($insertStmt->execute()) {
            // Update room availability
            $updateRoomQuery = "UPDATE rooms SET number_of_beds = number_of_beds - 1, 
                                is_available = CASE WHEN number_of_beds - 1 = 0 THEN 0 ELSE is_available END 
                                WHERE id = ?";
            $updateRoomStmt = $conn->prepare($updateRoomQuery);
            $updateRoomStmt->bind_param('i', $roomId);
            $updateRoomStmt->execute();

            echo json_encode(['success' => true, 'message' => 'Room reserved successfully.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error reserving room.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'User  not found.']);
    }
}
?>