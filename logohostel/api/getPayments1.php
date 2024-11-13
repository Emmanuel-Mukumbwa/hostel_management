<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query to count confirmed payments
    $confirmedQuery = "SELECT COUNT(*) as count FROM payments WHERE status = 'confirmed'";
    $pendingQuery = "SELECT COUNT(*) as count FROM payments WHERE status = 'pending'";

    $confirmedResult = $conn->query($confirmedQuery);
    $pendingResult = $conn->query($pendingQuery);

    $confirmedCount = $confirmedResult->fetch_assoc()['count'];
    $pendingCount = $pendingResult->fetch_assoc()['count'];

    echo json_encode([
        'success' => true,
        'confirmed_payments' => $confirmedCount,
        'pending_payments' => $pendingCount
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>