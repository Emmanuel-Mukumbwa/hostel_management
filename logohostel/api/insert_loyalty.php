<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db.php'; // Include your db connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    $username = $data->username;
    $totalDaysStayed = $data->total_days_stayed;
    $loyaltyDiscount = $data->loyalty_discount;

    // Insert loyalty data
    $query = "INSERT INTO user_loyalty (username, total_days_stayed, loyalty_discount, last_updated) VALUES (?, ?, ?, NOW())";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('sid', $username, $totalDaysStayed, $loyaltyDiscount);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Loyalty data inserted successfully.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error inserting loyalty data: ' . $stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>