<?php

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
// Connect to MySQL database
$host = 'localhost';
$username = 'root';
$db_password = 'password';
$database = 'citireports_db';
$conn = new mysqli($host, $username, $db_password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle signup request
if ($_SERVER["REQUEST_METHOD"] === 'POST' && isset($_POST['signup'])) {
    $email = $_POST['email'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Check if email is already taken
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        http_response_code(400); // Bad request
        echo "Email already taken.";
        exit();
    }
    
    // Hash password using bcrypt
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user data into database
    $sql = "INSERT INTO users (email, username, password) VALUES ('$email', '$username', '$hashed_password')";
    if ($conn->query($sql) === TRUE) {
        http_response_code(200); // OK
        echo "Signup successful.";
    } else {
        http_response_code(500); // Internal server error
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    exit();
}

// Handle login request
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
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

// Close MySQL connection
$conn->close();
?>