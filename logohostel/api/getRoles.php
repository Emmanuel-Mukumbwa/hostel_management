<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php';

$sql = "SELECT * FROM roles";
$result = $conn->query($sql);

$roles = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $roles[] = $row;
    }
}

echo json_encode($roles);
?>
