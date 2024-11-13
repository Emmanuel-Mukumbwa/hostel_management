<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $request_id = $_POST['request_id'];
  $reply_message = $_POST['message'];
  $reply_date = $_POST['date'];

  $query = "UPDATE maintenance SET status = 'Replied', reply_message = ?, reply_date = ? WHERE id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("ssi", $reply_message, $reply_date, $request_id);
  $stmt->execute();

  echo json_encode(['message' => 'Reply successfully sent.']);
} else {
  echo json_encode(['message' => 'Invalid request method.']);
}
?>
