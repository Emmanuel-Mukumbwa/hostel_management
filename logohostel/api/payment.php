<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");

include 'db.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $roomNumber = $_POST['room_number'];
    $duration = $_POST['duration'];
    $totalPrice = $_POST['total_price'];
    $paymentProof = $_FILES['payment_proof'];

    // Validate input
    if (empty($username) || empty($email) || empty($roomNumber) || empty($duration) || empty($totalPrice) || $paymentProof['error'] !== 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields or file upload error']);
        exit;
    }

    // Validate file type and size
    $allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($paymentProof['type'], $allowedFileTypes) || $paymentProof['size'] > 5000000) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid file type or file too large']);
        exit;
    }

    // Upload payment proof
    $targetDir = 'uploads/';
    $targetFile = $targetDir . basename($paymentProof['name']);
    if (!move_uploaded_file($paymentProof['tmp_name'], $targetFile)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to upload payment proof']);
        exit;
    }

    // Insert payment data into the database
    $sql = "INSERT INTO payments (username, email, room_number, duration, total_price, payment_proof) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssiis", $username, $email, $roomNumber, $duration, $totalPrice, $targetFile);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Payment submitted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to submit payment']);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
