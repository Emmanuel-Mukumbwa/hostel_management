<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode the incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Extract data from the request
    $roomId = $data['roomId'];
    $guests = $data['userInfo']['guests'];
    $student_id = $data['userInfo']['student_id'];
    $email = $data['userInfo']['email'];
    $contact = $data['userInfo']['contact'];

    // Update user information in the database
    $updateUserQuery = "UPDATE users SET email = ?, contact = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateUserQuery);
    $updateStmt->bind_param("ssi", $email, $contact, $student_id);
    
    if (!$updateStmt->execute()) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error updating user information. Please try again.'
        ]);
        $updateStmt->close();
        $conn->close();
        exit;
    }
    
    // Close the update statement
    $updateStmt->close();

    // Check if the room is already reserved or unavailable
    $checkQuery = "SELECT * FROM reservations WHERE room_id = ? AND status IN ('reserved', 'booked')";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("i", $roomId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Room is already reserved/booked
        echo json_encode([
            'status' => 'error',
            'message' => 'Room is already reserved or booked. Please choose a different room.'
        ]);
        exit;
    }

    // Insert reservation with a 'reserved' status
    $reserveQuery = "INSERT INTO reservations (room_id, student_id, status, created_at, updated_at) 
                     VALUES (?, ?, 'reserved', NOW(), NOW())";
    $stmt = $conn->prepare($reserveQuery);
    $stmt->bind_param("ii", $roomId, $student_id);
    
    if ($stmt->execute()) {
        $reservation_id = $stmt->insert_id;

        // Insert guest information if any (for double rooms)
        foreach ($guests as $guest) {
            $guest_name = $guest['name'];
            $guest_contact = $guest['contact'];

            $guestInsertQuery = "INSERT INTO guests (reservation_id, name, contact) 
                                 VALUES (?, ?, ?)";
            $guestStmt = $conn->prepare($guestInsertQuery);
            $guestStmt->bind_param("iss", $reservation_id, $guest_name, $guest_contact);
            $guestStmt->execute();
        }

        // Room is now temporarily unavailable for 24 hours
        echo json_encode([
            'status' => 'success',
            'message' => 'Room reserved successfully! It will be held for 24 hours.'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Error during reservation. Please try again.'
        ]);
    }

    $stmt->close();
    $conn->close();
}
?>