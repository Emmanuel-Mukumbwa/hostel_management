<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $image = $_FILES['image'];

  if ($image['error'] === 0) {
    $imageName = uniqid() . '.' . pathinfo($image['name'], PATHINFO_EXTENSION);
    $imagePath = 'uploads/' . $imageName;

    if (move_uploaded_file($image['tmp_name'], $imagePath)) {
      $sql = "INSERT INTO images (image_name, image_path) VALUES ('$imageName', '$imagePath')";
      $result = mysqli_query($conn, $sql);

      if ($result) {
        echo json_encode(['message' => 'Image uploaded successfully!']);
      } else {
        echo json_encode(['message' => 'Error uploading image!']);
      }
    } else {
      echo json_encode(['message' => 'Error moving uploaded file!']);
    }
  } else {
    echo json_encode(['message' => 'Error uploading image!']);
  }
} else {
  echo json_encode(['message' => 'Invalid request method!']);
}
?>
