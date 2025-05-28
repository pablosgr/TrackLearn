<?php
session_start();

require_once '../header.php';
require_once '../utils/curl_helper.php';

$url_fetch = "user";

echo callApi('GET', $url_fetch);
