<?php
session_start();

// Set headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: GET, POST"); // Allow both GET and POST
header("Content-Type: application/json");

// Generate CSRF token if it doesn't exist
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Return the CSRF token as JSON
echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
?>
