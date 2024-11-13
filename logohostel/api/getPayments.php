<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once 'db.php';

// Fetch pending payments
$query = "SELECT * FROM payments WHERE status = 'pending'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
  $pendingPayments = array();
  while ($row = mysqli_fetch_assoc($result)) {
    $pendingPayments[] = $row;
  }
  echo json_encode($pendingPayments);
} else {
  echo json_encode(array());
}

mysqli_close($conn);
?>