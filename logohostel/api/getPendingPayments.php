<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

// Include the database connection
require_once 'db.php';

// Fetch pending payments
$query = "SELECT * FROM payments WHERE status = 'pending'";
$result = mysqli_query($conn, $query);

$pendingPayments = array(); // Initialize an array to hold pending payments

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $pendingPayments[] = $row; // Add each row to the pending payments array
    }
}

// Output the pending payments in JSON format
echo json_encode($pendingPayments);

// Close the database connection
mysqli_close($conn);
?>