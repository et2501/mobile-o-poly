<?php

require_once('Main.class.php');

//prevent chaching
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Datum in der Vergangenheit

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_H
EADERS']}");
}

// The JSON standard MIME header.
header('Content-type: application/json');

if(isset($_POST['json']))
{	$json_data = $_POST['json'];

	$data = Main::allocateJSON($json_data['type'],$json_data['object']);
	
	echo json_encode($data);
}

?>