<?php
function getUserEmailByRequestId($requestId) {
    global $conn; // Assuming you're using mysqli connection

    $stmt = $conn->prepare("SELECT email FROM users WHERE username = (SELECT username FROM maintenance_requests WHERE id = ?)");
    $stmt->bind_param("i", $requestId);
    $stmt->execute();
    $result = $stmt->get_result();
    $email = $result->fetch_assoc()['email'] ?? null;
    $stmt->close();

    return $email;
}
?>