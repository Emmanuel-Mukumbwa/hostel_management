<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Prepare the SQL statement
    $query = "SELECT id, username, email, room_number, duration, total_price, payment_proof, created_at, status FROM payments";

    // Execute the query
    if ($result = mysqli_query($conn, $query)) {
        $payments = [];
        
        // Fetch all payments
        while ($row = mysqli_fetch_assoc($result)) {
            $payments[] = $row;
        }

        // Free the result set
        mysqli_free_result($result);

        // Return the payments as JSON
        echo json_encode(['success' => true, 'payments' => $payments]);
    } else {
        // Handle query error
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve payments']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close the database connection
mysqli_close($conn);
?>