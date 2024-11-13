<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['userId']) && isset($input['roleId'])) {
        $userId = $input['userId'];
        $roleId = $input['roleId'];

        $stmt = $conn->prepare("UPDATE users SET role_id = ? WHERE id = ?");
        $stmt->bind_param("ii", $roleId, $userId);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'User role updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update user role.']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
}
?>
