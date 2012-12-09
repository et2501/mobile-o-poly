<?php

//User Class
require_once('Trophy.class.php');
require_once('Location.class.php');
require_once('database.php');

class User
{	//Attributes
	private $lastKnownPosition; //Location
	private $money; //int
	private $currentGameID; //int gameID
	private $userRole; //int
	private $email; //string
	private $color; //string
	private $username; //string
	private $userID; //int
	private $distanceWalked; //int
	private $achievedTrophies = array(); //TrophyList
	
	//GETTERS and SETTERS if needed
	
	
	//AUTOR: BIBI
	//PARAMETER: $userID - ID for the selected User
	//			 $type - either "normal" for the normal User Object from the user table 
	//			 		 or "game" for the complete user_in_game object
	//RETURN VALUE: finished User object
	public static function loadFromDB($userID,$type)
	{	$usr = new User();
		
		$con = db_connect();
		
		if($type=='normal')
		{	$statement = $con->prepare('Select * from user where user_id = ?');
			$statement->execute(array($userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			
			$usr->email = $row['email'];
			$usr->userID = $row['user_id'];
			$usr->username = $row['username'];
		}
		if($type=='game')
		{	$statement = $con->prepare('select * from user_in_game inner join user on user_id = user inner join location on location_id = last_known_location where user_id = ?');
			$statement->execute(array($userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			
			$usr->fillInUser($row);
		}
		
		$con = null;
		return $usr;
	}
	
	
	public function saveToDB()
	{
	}
	
	
	//AUTOR: BIBI
	//RETURN VALUE: Array Object of this instance
	public function generateArray()
	{	$data = array('money'=>$this->money,'userRole'=>$this->userRole,'username'=>$this->username,'userID'=>$this->userID,'color'=>$this->color,'lastKnownPosition'=>$this->lastKnownPosition->generateArray());
		return $data;
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
	
	//AUTOR: BIBI
	//puts a user into a game --> into the user_in_game database with all required information
	//PARAMETERS: $game - the game the user should be put in
	//			  $role - either admin or normal
	//			  $money - the money value the user begins with
	public function putUserInGame($game,$role,$money)
	{	$this->userRole = $role;
		$this->currentGameID = $game;
		$this->money = $money;
		$this->color = User::createRandomColor();
		$this->distanceWalked = 0;
		
		$loc = new Location();
		$loc->accu = 0;
		$loc->lat = 0;
		$loc->lon = 0;
		$loc->saveToDB();
		
		$this->lastKnownPosition = $loc;
		
		$con = db_connect();
		
		$statement = $con->prepare('Insert into user_in_game (user,game,money,distance_walked,role,color,last_known_location) values (?,?,?,?,?,?,?)');
		$statement->execute(array($this->userID,$this->currentGameID,$this->money,$this->distanceWalked,$this->userRole,$this->color,$this->lastKnownPosition->locationID));
		
		$con = null;
	}
	
	//AUTOR: BIBI
	//gets all users for a specified game
	//RETURN VALUE: USER list
	public static function getUsersInGame($game)
	{	$users = array();
		$con = db_connect();
		
		$statement = $con->prepare('select * from user_in_game inner join user on user_id = user inner join location on location_id = last_known_location where game = ?');
		$statement->execute(array($game));
		$result = $statement;
		
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{	$usr = new User();
			
			$usr->fillInUser($row);
			
			$users[] = $usr;
		}
		
		
		$con = null;
		return $users;
	}
	
	//AUTOR: BIBI
	private function fillInUser($row)
	{	$this->color = $row['color'];
		$this->userID = $row['user_id'];
		$this->username = $row['username'];
		$this->money = $row['money'];
		$this->userRole = $row['role'];
			
		$loc = new Location();
		$loc->accu = $row['radius'];
		$loc->lat = $row['lat'];
		$loc->lon = $row['lon'];
		$loc->locationID = $row['location_id'];
			
		$this->lastKnownPosition = $loc;
	}
	
	//AUTOR: BIBI
	//returns a random hex code 
	//TODO ----> luminance!!!!!
	private static function createRandomColor()
	{	return User::createRandomColorPart() . User::createRandomColorPart() . User::createRandomColorPart();
	}
	
	private static function createRandomColorPart()
	{	return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
	}	
	
}


?>