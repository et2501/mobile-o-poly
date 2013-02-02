<?php

// file updated by skripted - 02.02.13
require_once('config.php');

function db_connect() {	
  try {
    return new PDO('mysql:host=' . DBHOST . ';dbname=' . DBNAME, DBUSER, DBPASS);
  } 
  catch(PDOException $e) {
    return "Could not Connect to Server!";
  }
}

?>