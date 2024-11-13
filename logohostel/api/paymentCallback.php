<?php
// paymentCallback.php

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000"); // Adjust as needed
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST");

// Include your database connection
include 'db.php'; // Ensure this file contains the database connection logic

// Check if the required parameters are present
if (!isset($_GET['tx_ref']) || !isset($_GET['status']) || !isset($_GET['amount'])) {
    echo json_encode(['message' => 'Missing parameters.']);
    exit;
}

// Get the payment response from PayChangu
$transactionReference = $_GET['tx_ref']; // Transaction reference
$status = $_GET['status']; // Payment status
$amount = $_GET['amount']; // Amount paid

// Prepare and bind
$sql = "INSERT INTO payments (tx_ref, status, amount, created_at) VALUES (?, ?, ?, NOW())";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssi", $transactionReference, $status, $amount);

// Execute the statement
if ($stmt->execute()) {
    echo json_encode(['message' => 'Payment recorded successfully!']);
} else {
    echo json_encode(['message' => 'Error recording payment: ' . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>