<?php
// confirmPayment.php

include 'db.php'; // Include your database connection

// Get the raw POST data
$json = file_get_contents('php://input');

// Decode the JSON data into an associative array
$data = json_decode($json, true);

// Check if 'paymentId' exists in the array
if (isset($data['paymentId'])) {
    $paymentId = $data['paymentId'];

    // Update the payment status in the database
    $query = "UPDATE payments SET status = 'confirmed' WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $paymentId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Payment confirmed successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error"]);
    }

    $stmt->close();
} else {
    // Handle the error when 'paymentId' is missing
    echo json_encode(["success" => false, "message" => "paymentId is required."]);
}

$conn->close();
?>