<?php
//check_payment_status.php
header("Content-Type: application/json");
include 'db.php'; // Include your database connection file

$username = $_GET['username'];
$email = $_GET['email'];
$room_number = $_GET['room_number']; // Get room number from the request

// Query to check payment status
$query = "SELECT * FROM payments WHERE username = ? AND email = ? AND room_number = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssi", $username, $email, $room_number); // Bind room_number as an integer
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $payment = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'status' => $payment['status'],
        'room_number' => $payment['room_number'],
        'total_price' => $payment['total_price'],
        'created_at' => $payment['created_at']
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'No payment record found']);
}
?>