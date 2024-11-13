
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
session_start();

// Assuming the user is logged in and stored in the session
if (isset($_SESSION['username'])) {
    echo json_encode(['username' => $_SESSION['username']]);
} else {
    // In case of no session, return an error
    echo json_encode(['error' => 'User not logged in']);
}
?>
