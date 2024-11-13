//getRoomDetails.php
<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Prepare the SQL statement
    $query = "SELECT id, type, price, number_of_beds FROM room_details";
    
    // Execute the query
    if ($result = mysqli_query($conn, $query)) {
        $room_details = [];
        
        // Fetch all room details
        while ($row = mysqli_fetch_assoc($result)) {
            $room_details[] = $row;
        }

        // Free the result set
        mysqli_free_result($result);

        // Return the room details as JSON
        echo json_encode(['success' => true, 'room_details' => $room_details]);
    } else {
        // Handle query error
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve room details']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

// Close the database connection
mysqli_close($conn);
?>