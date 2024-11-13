<?php
// getUsers.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$search = isset($_GET['search']) ? $_GET['search'] : '';

$limit = 5;
$offset = ($page - 1) * $limit;

// SQL to fetch users and roles with pagination and search functionality
$sql = "SELECT users.id, users.username, users.email, users.contact, roles.role_name 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.username LIKE ? 
        ORDER BY users.username DESC 
        LIMIT ? OFFSET ?";

$stmt = $conn->prepare($sql);
$searchPattern = "%$search%";
$stmt->bind_param("sii", $searchPattern, $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

// SQL to count total users matching the search criteria
$countSql = "SELECT COUNT(*) as total 
             FROM users 
             WHERE username LIKE ?";
$countStmt = $conn->prepare($countSql);
$countStmt->bind_param("s", $searchPattern);
$countStmt->execute();
$countResult = $countStmt->get_result();
$totalCountRow = $countResult->fetch_assoc();
$totalCount = $totalCountRow['total'];

// Prepare the response
$response = [
    'total' => $totalCount,
    'users' => $users
];

// Return the response as JSON
echo json_encode($response);
?>