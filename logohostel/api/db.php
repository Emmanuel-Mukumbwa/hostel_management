<?php
// db.php
$host = 'localhost';
$dbname = 'hostel_management';
$user = 'root';  // MySQL user (default for XAMPP)
$pass = '';      // MySQL password (leave empty for XAMPP)

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character encoding (optional but recommended)
$conn->set_charset("utf8");

?>
