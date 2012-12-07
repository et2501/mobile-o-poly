<?php

//Game class represents an active game

require_once('Card.class.php');
require_once('Building.class.php');
require_once('Playground.class.php');
require_once('User.class.php');
require_once('database.php');

class Game
{	//Attributes
	private $buildingList=array(); //array of Building instances  - buildings in game
	private $cardList=array(); //array of Card instances - cards in game
	private $gameName; //string - game name
	private $creationDate; //DateTime - date of creation
	private $playground; //Playground - the playground on which the game is played
	private $isStarted; //bool
	private $finished; //bool
	private $mode; //int - mode of game
	private $timeToPlay; //int - time to play in seconds (if required)
	private $gameID; //int - id of this game
	private $attendingUsers=array(); //User List - all users who are in the game
	
	//GETTERS and SETTERS if required
	
	//AUTOR: BIBI
	//creates a new game and stores it in the databases
	public function createNewGame($pg,$name,$mode,$timeToPlay,$master)
	{	//PART 1 FILL IN ALL GAME ATTRIBUTES
		$this->gameName = $name;
		$this->isStarted = false;
		$date = new DateTime();
		$this->creationDate = date('Y-m-d H:i:s',$date->getTimestamp());
		if($mode == 'Zeit')
			$this->timeToPlay = $timeToPlay;
		
		$con = db_connect();
		
		//get the mode ID
		$statement = $con->prepare('Select mode_id from mode where name = ?');
		$statement->execute(array($mode));
		$result = $statement;
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		$this->mode = $row['mode_id'];
		
		//get Playground
		$this->playground = Playground::loadFromDB($pg);
		
		//insert this game into DB and save the ID
		$this->gameID = $this->saveToDB();
			
		//PART 2 GENERATE THE BUILDINGS
		$this->buildingList = Building::generateSelectedBuildings($pg,$this->gameID);
		
		//PART 3 GENERATE THE CARDS
		$this->cardList = Card::generateSelectedCards($this->gameID,count($this->buildingList)*2); //<<<<<<
		
		//PART 4 generate the attended Users --> in this case only the game master!!
		$usr = new User();
		$usr = User::loadFromDB($master,'normal');
		$usr->putUserInGame($this->gameID,'admin',$this->playground->getStartMoney());
		$this->attendingUsers[] = $usr;
	}
	
	//starts the game
	public function startGame()
	{
	}
	
	//AUTOR: BIBI
	//generates an array of this instance
	//RETURN VALUE: array
	public function generateArray()
	{	$buildings = array();
		$cards = array();
		$users = array();
	
		foreach($this->buildingList as $build)
			$buildings[] = $build->generateArray('game');
		
		foreach($this->cardList as $card)
			$cards[] = $card->generateArray();
		
		foreach($this->attendingUsers as $user)
			$users[] = $user->generateArray();
		
		$data = array('gameID'=>$this->gameID,'gameName'=>$this->gameName,'creationDate'=>$this->creationDate,'isStarted'=>$this->isStarted,'finished'=>$this->finished,'timeToPlay'=>$this->timeToPlay,'mode'=>array('name'=>$this->mode),'playground'=>$this->playground->generateArray(false),'buildings'=>$buildings,'users'=>$users,'cards'=>$cards);
		return $data;
	}
	
	//saves this instance into the database
	//RETURN VALUE: int - insert ID
	public function saveToDB()
	{	$con = db_connect();
	
		if($this->mode=='Zeit')
		{	$statement = $con->prepare('Insert into game (name,creation_date,playground,finished,mode,time_to_play,is_started) values (?,?,?,?,?,?,?)');
			$statement->execute(array($this->gameName,$this->creationDate,$this->playground->getID(),$this->finished,$this->mode,$this->timeToPlay,$this->isStarted));
		}
		else
		{	$statement = $con->prepare('Insert into game (name,creation_date,playground,finished,mode,is_started) values (?,?,?,?,?,?)');
			$statement->execute(array($this->gameName,$this->creationDate,$this->playground->getID(),$this->finished,$this->mode,$this->isStarted));
		}
		
		$id = $con->lastInsertId();
		$con = null;
		return $id;
	}
	
	//evtl mal statisch?? + übergabe der game id?
	//Adds a User to the Game
	//PARAMETER: int $userID - User to be added
	public function attendGame($userID)
	{
	}	
	
	//Loads one data row from Games
	//PARAMETER: string $gameName - name of the Game to be selected
	//RETURN VALUE: Game
	public static function loadFromDB($gameName)
	{
	}
}

?>