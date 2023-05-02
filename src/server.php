<?php

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// Connect to MySQL database
$host = 'localhost';
$username = 'root';
$db_password = '';
$database = 'citireports_db';
$conn = new mysqli($host, $username, $db_password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user = file_get_contents('php://input');
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];


// Handle signup request
if ($method === 'POST' && $uri === '/citireports/api/signup') {
  $user = json_decode(file_get_contents('php://input'));

  // Check if email is already taken
  $sql = "SELECT * FROM users WHERE email = '$user->email'";
  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
      http_response_code(400); // Bad request
      echo "Email already taken.";
      exit();
  } else {
    // $password = stripslashes($user.password]);
    // $password = mysqli_real_escape_string($conn, $password);
  	$password = $user->password;
    // Hash password using bcrypt
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user data into database
    $sql = "INSERT INTO users (id, email, username, password) VALUES (null, '$user->email',
      '$user->username', '$hashed_password')";
    if ($conn->query($sql) === TRUE) {
        http_response_code(200); // OK
        echo "Signup successful.";
    } else {
        http_response_code(500); // Internal server error
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    exit();
  }
}

// Handle login request
if ($_SERVER["REQUEST_METHOD"] === "POST" && $uri === '/citireports/api/login') {
    $user = json_decode(file_get_contents('php://input'));
    $email = $user->email;
    $password = $user->password;

    // Retrieve user data from database
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    if ($result->num_rows == 0) {
        http_response_code(401); // Unauthorized
        echo "Invalid email or password.";
        exit();
    }
    $row = $result->fetch_assoc();

    // Verify password using bcrypt
    if (password_verify($password, $row['password'])) {
        http_response_code(200); // OK
        echo "Login successful.";
    } else {
        http_response_code(401); // Unauthorized
        echo "Invalid email or password.";
    }
    exit();
}

//handle report requests
if ($_SERVER["REQUEST_METHOD"] === "POST" && $uri === '/citireports/api/incidents') {
  // Get the uploaded file data
  // Access form data submitted via multipart/form-data
  $category = $_POST['category'];
  $description = $_POST['description'];
  $location = $_POST['location'];
  $images = $_FILES['images'];

  // Create a directory to store the images (if it doesn't already exist)
  $uploadDir = 'uploads/';
  if (!file_exists($uploadDir)) {
    mkdir($uploadDir);
  }

  // Insert report data into database
  $sql = "INSERT INTO reports (id, category, description, location) VALUES (null, '$category',
    '$description', '$location')";
  if ($conn->query($sql) === TRUE) {
      http_response_code(200); // OK
      echo "Reported Successfully.";
  } else {
      http_response_code(500); // Internal server error
      echo "Error: " . $sql . "<br>" . $conn->error;
  }

  // Retrieve user data from database
  $sql = "SELECT * FROM reports WHERE description = '$description'";
  $result = $conn->query($sql);
  $row = $result->fetch_assoc();
  $post_id = $row['id'];

  // If file upload form is submitted
  if ($images) {
    // File upload configuration
    $targetDir = "uploads/";
    $allowTypes = array('jpg','png','jpeg','gif');

    $statusMsg = $errorMsg = $insertValuesSQL = $errorUpload = $errorUploadType = '';
    $fileNames = array_filter($_FILES['images']['name']);
    if(!empty($fileNames)){
        foreach($_FILES['images']['name'] as $key=>$val){
            // File upload path
            $fileName = basename($_FILES['images']['name'][$key]);
            $targetFilePath = $targetDir . $fileName;

            // Check whether file type is valid
            $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
            if(in_array($fileType, $allowTypes)){
                // Upload file to server
                if(move_uploaded_file($_FILES["images"]["tmp_name"][$key], $targetFilePath)){
                    // Image db insert sql
                    $insertValuesSQL .= "('$fileName', NOW(), $post_id),";
                }else{
                    $errorUpload .= $_FILES['images']['name'][$key].' | ';
                }
            }else{
                $errorUploadType .= $_FILES['images']['name'][$key].' | ';
            }
        }

        // Error message
        $errorUpload = !empty($errorUpload)?'Upload Error: '.trim($errorUpload, ' | '):'';
        $errorUploadType = !empty($errorUploadType)?'File Type Error: '.trim($errorUploadType, ' | '):'';
        $errorMsg = !empty($errorUpload)?'<br/>'.$errorUpload.'<br/>'.$errorUploadType:'<br/>'.$errorUploadType;

        if(!empty($insertValuesSQL)){
            $insertValuesSQL = trim($insertValuesSQL, ',');
            // Insert image file name into database
            $insert = $conn->query("INSERT INTO images (file_name, uploaded_on, post_id) VALUES $insertValuesSQL");
            if($insert){
                $statusMsg = "Files are uploaded successfully.".$errorMsg;
            }else{
                $statusMsg = "Sorry, there was an error uploading your file.";
            }
        }else{
            $statusMsg = "Upload failed! ".$errorMsg;
        }
    }else{
        $statusMsg = 'Please select a file to upload.';
    }

    echo $statusMsg;
  }
}

//handle report retrieval requests
if ($_SERVER["REQUEST_METHOD"] === "GET" && $uri === '/citireports/api/reports') {
  // Retrieve reports data from database
  $sql = "SELECT * FROM reports";
  $result = $conn->query($sql);
  $reports = array();

  // Loop through each report
  while ($row = $result->fetch_assoc()) {
    $report = array(
      'id' => $row['id'],
      'category' => $row['category'],
      'description' => $row['description'],
      'location' => $row['location']
    );

    // Retrieve images associated with this report
    $sql = "SELECT file_name FROM images WHERE post_id = {$row['id']}";
    $imageResult = $conn->query($sql);
    $images = array();

    // Loop through each image and add its filename to the images array
    while ($imageRow = $imageResult->fetch_assoc()) {
      $images[] = $imageRow['file_name'];
    }

    // Add the images array to the report
    $report['images'] = $images;

    // Add the report to the reports array
    $reports[] = $report;
  }

  // Set the response header to JSON
  header('Content-Type: application/json');

  // Encode the reports array as JSON and return it
  echo json_encode($reports);
}
// Close MySQL connection
$conn->close();
?>
