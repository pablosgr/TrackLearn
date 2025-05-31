<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['name']) ||
    !isset($data['username']) || 
    !isset($data['email']) || 
    !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$data_post = array(
    'name' => $data['name'],
    'username' => $data['username'],
    'email' => $data['email'],
    'password' => $data['password'],
    'role' => "teacher"
);

$url_fetch = "user";

echo callApi('POST', $url_fetch, $data_post);
