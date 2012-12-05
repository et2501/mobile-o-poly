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
	
	
	//AUTOR: BIBI
	//PARAMETER: $userID - ID for the selected User
	//			 $type - either "normal" for the normal User Object from the user table 
	//			 		 or "game" for the complete user_in_game object
	//RETURN VALUE: finished User object
	public static function loadFromDB($userID,$type)
	{	$user = new User();
		
		$con = db_connect();	
	
		if($type == 'normal')
		{	$query = "Select * from user where user_id = ?";
			$statement = $con->prepare($query);
			$statement->execute(array($userID));
			$result = $statement;
			
			$con = null; //close connection
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$user->email = $row['email'];
			$user->username = $row['username'];
			$user->userID = $row['user_id'];
			$user->getAchievedTrophies();
		}
	
		return $user;
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
	
	
	public function rolledDice($number)
	{
	}
	
}


?>