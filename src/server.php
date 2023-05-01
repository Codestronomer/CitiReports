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
if ($method === 'POST' && $uri === '/citireports/signup') {
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
if ($_SERVER["REQUEST_METHOD"] === "POST" && $uri === '/citireports/login') {
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
if ($_SERVER["REQUEST_METHOD"] === "POST" && $uri === '/citireports/incidents') {
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
    $status = $statusMsg = '';
    $status = 'error';
    if(!empty($_FILES["image"]["name"])) {
        // Get file info
        $fileName = basename($_FILES["image"]["name"]);
        $fileType = pathinfo($fileName, PATHINFO_EXTENSION);

        // Allow certain file formats
        $allowTypes = array('jpg','png','jpeg','gif');
        if(in_array($fileType, $allowTypes)){
            $image = $_FILES['image']['tmp_name'];
            $imgContent = addslashes(file_get_contents($image));

            // Insert image content into database
            $insert = $db->query("INSERT into images (id, image, post_id, created_at) VALUES (null, '$imgContent', '$post_id', NOW())");
            if($insert){
                $status = 'success';
                $statusMsg = "File uploaded successfully.";
            }else{
                $statusMsg = "File upload failed, please try again.";
            }
        }else{
            $statusMsg = 'Sorry, only JPG, JPEG, PNG, & GIF files are allowed to upload.';
        }
    }else{
        $statusMsg = 'Please select an image file to upload.';
    }
  }

  // Display status message
  echo $statusMsg;

  // loop through uploaded files
  // foreach ($images['tmp_name'] as $key => $tmp_name) {
  //     // handle each file
  //     $file_name = $images['name'][$key];
  //     $file_size = $images['size'][$key];
  //     $file_tmp = $images['tmp_name'][$key];
  //     $file_type = $images['type'][$key];
  //
  //     // move file to desired location
  //     move_uploaded_file($file_tmp, "uploads/".$file_name);
  // }
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && $uri === '/citireports/incidents') {

  // Retrieve user data from database
    $sql = "SELECT * FROM reports";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    print_r($result);

    if ($result->num_rows > 0) {
        http_response_code(200); // Bad request
        echo $result;
        exit();
}

// Close MySQL connection
$conn->close();
?>
