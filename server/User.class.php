<?php

//User Class
require_once('Trophy.class.php');
require_once('Location.class.php');
require_once('database.php');

class User
{	//Attributes
	public $lastKnownPosition; //Location
	public $money; //int
	private $currentGameID; //int gameID
	private $userRole; //int
	private $email; //string
	private $color; //string
	private $username; //string
	private $userID; //int
	public $distanceWalked; //int
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
		{	
			
			$statement = $con->prepare('SELECT * FROM user_in_game INNER JOIN user ON user_id = user LEFT JOIN location ON location_id = last_known_location WHERE user_id =? AND game NOT IN ( SELECT game FROM logger WHERE text =13 AND user=?)');
			$statement->execute(array($userID,$userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
	
			if($row)
			{
					$usr->fillInUser($row);
			}
			else
			{
				return "e109";
			}
			
			
		}
		
		$con = null;
		return $usr;
	}
	
	public function getUserID()
	{
		return $this->userID;
	}
	public function setNickname($nickname)
	{
		$this->username=$nickname;
	}
	public function getUserRole()
	{
		return $this->userRole;
	}
	
	
	
	public function saveUserToDB()
	{
		$con = db_connect();
		
		$statement = $con->prepare('update user set e-mail=?, username=?');
		$statement->execute(array($this->email,$this->username));
		
		$con = null;
	}
	public function changeUserInGameInDB($gameID)
	{
		$con = db_connect();
		
		$statement = $con->prepare('update user_in_game set money=?, distance_walked=?, last_known_location=? where user=? AND game=?');
		$statement->execute(array($this->money,$this->distanceWalked,$this->lastKnownPosition->locationID, $this->userID, $gameID));
		
		$con = null;
	}
	public function gotSpeedingTicket()
	{
		//SpeedingTicket= 10% of currentMoney
		$this->money=$this->money*0.9;
	}
	
	
	
	//AUTOR: MiKe
	public function userGotCard($game, $card, $moneyToGo){
		
		/*
		$amount = $card->getAmount();
		
		//sofortiger Zuschuss
		if($card->type=='12'){
			$this->money += $moneyToGo * $amount;
		}
													
		//sofortiger Abzug
		else if($card->type=='15'){
													
			$this->money -= $moneyToGo * $amount;				
		}	
		
		$this->saveUserToDB();*/
		
	}
	
	
	
	
	//AUTOR: BIBI
	//RETURN VALUE: Array Object of this instance
	public function generateArray()
	{	
		$data = array('email'=>$this->email, 'money'=>$this->money,'distanceWalked'=>(int)$this->distanceWalked,'userRole'=>$this->userRole,'username'=>$this->username,'userID'=>$this->userID,'color'=>$this->color);
		if($this->lastKnownPosition!=null)
			$data['lastKnownPosition']=$this->lastKnownPosition->generateArray();
		
		if($this->achievedTrophies!=null)
		{
			$trophies=array();
			foreach($this->achievedTrophies as $trophy)
				$trophies[] = $trophy->generateArray();
			
			$data['trophy']=$trophies;
		}
		return $data;
	}
	
	//AUTOR: TOM
	//RETURN VALUE: Array Object of this instance
	public function generateStatisticsArray($gameID = null)
	{
		$gotCards=null;
		
		$con = db_connect();
					
		if($gameID!=null)
		{
			$statement = $con->prepare("Select COUNT(*) from logger where user = ? AND game=? AND card IS NOT NULL");
			$statement->execute(array($this->userID, $gameID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$gotCards=$row[0];
			
			$data = array('gotCards'=>$gotCards,'distanceWalked'=>$this->distanceWalked,'money'=>$this->money,'userRole'=>$this->userRole,'username'=>$this->username,'userID'=>$this->userID,'color'=>$this->color,'lastKnownPosition'=>$this->lastKnownPosition->generateArray());
		return $data;
			
			
		}
		
		else
		{
			//Count the raised Cards by User 
			$statement = $con->prepare("Select COUNT(*) from logger where user = ? AND card IS NOT NULL");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$gotCards=$row[0];
			
			//sum of the walked distance
			$statement = $con->prepare("Select SUM(distance_walked) from user_in_game where user = ?");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$sumDistanceWalked=$row[0];
			
			//maxMoney at the end of a game
			$statement = $con->prepare("Select MAX(money) from user_in_game where user = ?");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$maxMoney=$row[0];
			
			//SumMoney over all 
			$statement = $con->prepare("Select SUM(money) from user_in_game where user = ?");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$sumMoney=$row[0];
			
			//gameCount over all 
			$statement = $con->prepare("Select Count(*) from user_in_game where user = ?");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$gameCount=$row[0];
			
			//gameCount over all 
			$statement = $con->prepare("Select Count(*) from logger where user = ? AND text=11");
			$statement->execute(array($this->userID));
			$result = $statement;
			
			$row = $result->fetch(PDO::FETCH_ASSOC);
			$gamesWon=$row[0];
			
			$data = array('gotCards'=>$gotCards,'sumDistanceWalked'=>$sumDistanceWalked,'maxMoney'=>$maxMoney,'sumMoney'=>$sumMoney,'gameCount'=>$gameCount,'gamesWon'=>$gamesWon,'money'=>$this->money,'userRole'=>$this->userRole,'username'=>$this->username,'userID'=>$this->userID,'color'=>$this->color);
		return $data;
			
		}
		
		
		
		
		
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
		$this->email=$row['email'];
		
		$this->distanceWalked=$row['distance_walked'];
			
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
	{	
		//Formel für luminanz (0.2126*R) + (0.7152*G) + (0.0722*B)
		//bei 255,255,255=  54,213+ 182,376+ 18,411
		//255. am Besten wahrscheinlich zwischen 100 und 200
		$red=0;
		$green=0;
		$blue=0;
		$foundLumi=false;
		
		while(!$foundLumi)
		{
			$red=mt_rand(0,255);
			$green=mt_rand(0,255);
			$blue=mt_rand(0,255);
			
			if(($red*0.2126+$green*0.7152+$blue*0.0722)>100&&($red*0.2126+$green*0.7152+$blue*0.0722)<200)
			{
				$foundLumi=true;
			}
		}
		
		return str_pad( dechex( $red ), 2, '0', STR_PAD_LEFT) . str_pad( dechex( $green ), 2, '0', STR_PAD_LEFT) . str_pad( dechex( $blue ), 2, '0', STR_PAD_LEFT);
	}
	
}


?>