<?php

//User Class
require_once('Trophy.class.php');
require_once('database.php');

class User
{	//Attributes
	private $lastKnownPosition; //Location
	private $Money; //int
	private $currentGame; //Game
	private $userRole; //int
	private $email; //string
	private $color; //string
	private $username; //string
	private $userID; //int
	private $achievedTrophies = array(); //TrophyList
	
	//GETTERS and SETTERS if needed
	
	
	//PARAMETER: $userID - ID for the selected User
	//			 $type - either "normal" for the normal User Object from the user table 
	//			 		 or "game" for the complete user_in_game object
	//RETURN VALUE: finished User object
	public static function loadFromDB($userID)
	{	
	}
	
	
	public function saveToDB()
	{
	}
	
	
	//RETURN VALUE: Array Object of this instance
	public function generateArray()
	{
	}
	
	//AUTOR: BIBI
	//gets all the achieved trophies of this user instance
	public function getAchievedTrophies()
	{	$this->achievedTrophies = Trophy::getUserTrophies($this->userID);
	}
	
	//AUTOR: BIBI
	//helper function - gets the username from a user
	//PARAMETER: $userID - id of user 
	//RETURNS: string - username
	public static function getNickname($userID)
	{	$con = db_connect();
	
		$statement = $con->prepare("Select username from user where user_id = ?");
		$statement->execute(array($userID));
		$result = $statement;
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		return $row['username'];
	}
	
	
	public function rolledDice($number)
	{
	}
	
}


?>