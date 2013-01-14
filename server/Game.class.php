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
	public function getPlayground()
	{
		return $this->playground;
	}
	//AUTOR: BIBI
	//creates a new game and stores it in the databases
	public function createNewGame($pg,$name,$mode,$timeToPlay,$master)
	{	//first look if there is any running game with this specified name -->> if so then error msg
		$con = db_connect();
		
		$statement = $con->prepare('Select * from game where name = ? and finished is null');
		$statement->execute(array($name));
		$result = $statement;
		
		$con = null;
		
		if($result->rowCount()==0)
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
			
			$this->cardList = Card::generateSelectedCards($this->gameID,$this->buildingList); //<<<<<<
			
			//PART 4 generate the attended Users --> in this case only the game master!!
			$usr = new User();
			$usr = User::loadFromDB($master,'normal');
			$usr->putUserInGame($this->gameID,'admin',$this->playground->getStartMoney());
			$this->attendingUsers[] = $usr;
			
			//logentry 6 --> createNewGame
			$logentry=new Log();
			$logentry->user=$usr;
			$logentry->Text='6';
			$logentry->game=$this;
			$logentry->saveToDB();
			
			return "OK";
		}
		else
			return "e107";
	}
	public function getGameID()
	{
		return $this->gameID;
	}
	
	//AUTOR: BIBI
	//starts the game
	public function startGame()
	{	$this->isStarted = true;
		
		//save change to db
		$con = db_connect();
		$statement = $con->prepare('Update game set is_started = true where game_id = ?');	
		$statement->execute(array($this->gameID));
			
		$logentry=new Log();
		$logentry->Text='8';
		$logentry->game=$this;
		$logentry->saveToDB();
			
		$con = null;
	}
	public function stopGame()
	{
		//save change to db
		$con = db_connect();
		
		$date = new DateTime();
		$date = date('Y-m-d H:i:s',$date->getTimestamp());
		
		$statement = $con->prepare('Update game set finished = ? where game_id = ?');	
		$statement->execute(array($date,$this->gameID));
		
			
		$con = null;
	}
	
		
	//AUTOR: BIBI
	//generates an array of this instance
	//RETURN VALUE: array
	public function generateArray()
	{	$buildings = array();
		$cards = array();
		$users = array();
		$debugs=null;
		
		
		
		if($this->finished==null&&$this->isStarted==true)
		{
			switch ($this->mode)
			{
			case 1:
					//Monopol
					$startbuilding=$this->buildingList[0];
					$foundWinner=true;
					$startowner=null;
					if($startbuilding->owner!=null)
					{
					  $startowner=$startbuilding->owner->getUserID();
					}
					foreach($this->buildingList as $build)
					{
						if($startowner!=null)
						{
					  		if($startowner!=$build->owner->getUserID())
							{
								$foundWinner=false;
							}
						}
						else
						{
							$foundWinner=false;
						}
									
					}
					$buildings[] = $build->generateArray('game');
					
					if($foundWinner)
					{
						$date = new DateTime();
						$this->finished=$date;
						$this->stopGame();
						
						
						//log eintrag für gewinner
						
						$logentry=new Log();
						$logentry->user=$startowner;
						$logentry->Text='11';
						$logentry->game=$this;
						$logentry->saveToDB();
						
					}
					
					break;
			case 2: 
					//Wirtschaft
					//The player, who has more money than everyone else combined wins
					$foundWinner=false;
					$winner=null;
					//doppelt verschachtelte for-schleife: 
					foreach($this->attendingUsers as $outerUser)
					{	
						if(!$foundWinner)
						{
						  $user->money;
						  $sumMoney=0;
						  foreach($this->attendingUsers as $innerUser)
						  {
							  if($outerUser->getUserID()!=$innerUser->getUserID())
							  {
								  if(count($this->attendingUsers==2))
								  	$sumMoney+=$innerUser->money*3;
								  
								  else
								  	$sumMoney+=$innerUser->money;
							  }
						  
						  }
						  if($outerUser->money>$sumMoney)
						  {
							  $foundWinner=true;
							  $winner=$outerUser;
						  }
						}
						
					}
					if($foundWinner)
					{
						$date = new DateTime();
						$this->finished=$date;
						$this->stopGame();						
						
						$logentry=new Log();
						$logentry->user=$winner;
						$logentry->Text='11';
						$logentry->game=$this;
						$logentry->saveToDB();
					}	
					break;
			case 3: 
					//Zeit
					$date = new DateTime();
					$enddate=new DateTime($this->creationDate);
					
					$enddate->modify('+ '.$this->timeToPlay.' minutes');
					if($enddate->getTimestamp()<$date->getTimestamp())
					{
						//check who won and add it to the log with log 11
						
						$this->finished=$date;
						$this->stopGame();
						
						//noch rausfinden, wer gewonnen hat und den log speichern!
						//eine for schleife
						$winner=$this->attendingUsers[0];
						
						foreach($this->attendingUsers as $user)
						{
							if($user->money>$winner->money)
							{
								$winner=$user;
							}
						}
						
						$logentry=new Log();
						$logentry->user=$winner;
						$logentry->Text='11';
						$logentry->game=$this;
						$logentry->saveToDB();
						
						
						
					}
					break;
			default: 
					break;
		}
		}
	
		foreach($this->buildingList as $build)
			$buildings[] = $build->generateArray('game');
		
		foreach($this->cardList as $card)
			$cards[] = $card->generateArray();
		
		foreach($this->attendingUsers as $user)
			$users[] = $user->generateArray();
		
		$data = array('gameID'=>$this->gameID,'gameName'=>$this->gameName,'creationDate'=>$this->creationDate,'isStarted'=>$this->isStarted,'finished'=>$this->finished,'timeToPlay'=>$this->timeToPlay,'mode'=>array('mode_id'=>$this->mode,'name'=>Game::getModeName($this->mode)),'playground'=>$this->playground->generateArray(false),'buildings'=>$buildings,'users'=>$users,'cards'=>$cards,'debug'=>$debug);
		return $data;
	}
	
	//AUTOR: BIBI
	//saves this instance into the database
	//RETURN VALUE: int - insert ID
	public function saveToDB()
	{	$con = db_connect();
	
		if($this->mode=='3')
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
	
	//AUTOR: BIBI
	//Adds a User to the Game
	//PARAMETER: user object
	//RETURN VALUE: eihter OK or error code
	public function attendGame($user)
	{	//First look if there is still space
		if($this->playground->getMaxPlayers() > count($this->attendingUsers))
		{	//then look if game is already started
			if(!$this->isStarted)
			{	
				if($this->finished==null)
				{
					$this->attendingUsers[] = $user;
					$user->putUserInGame($this->gameID,'player',$this->playground->getStartMoney());
					
					
					//logentry 7 --> attendGame
					$logentry=new Log();
					$logentry->user=$user;
					$logentry->Text='7';
					$logentry->game=$this;
					$logentry->saveToDB();
					
					//now look if all player slots are full ---> if so start game!!!
					if($this->playground->getMaxPlayers() == count($this->attendingUsers))
						$this->startGame();
						
					return "OK";
				}
				else
					return "e111";
			}
			else
				return "e105";
		}
		else	
			return "e106";
	}	
	
	//AUTOR: BIBI
	//Loads one data row from Games either through name (and finished is null for only the running games) or throuhg ID
	//if the ID is set the name will be ignored
	//PARAMETER: string $gameName - name of the Game to be selected
	//			 int $gameID - id of the Game to be selected
	//RETURN VALUE: Game - or if gameName not to find --> return error code
	//              or game Array
	public static function loadFromDB($gameName,$gameID = null)
	{	$gam = new Game();
	
		$con = db_connect();
		
		if($gameID!=null)
		{	$statement = $con->prepare('Select * from game where game_id = ?');
			$statement->execute(array($gameID));
		}
		else
		{	$statement = $con->prepare('Select * from game where name = ? and finished is null');
			$statement->execute(array($gameName));
		}
		
		$result = $statement;
		if($result->rowCount()!=0)
		{	$row = $result->fetch(PDO::FETCH_ASSOC);
				
			$gam->creationDate = $row['creation_date'];
			$gam->finished = $row['finished'];
			$gam->gameID = $row['game_id'];
			$gam->gameName = $row['name'];
			$gam->isStarted = $row['is_started'];
			$gam->timeToPlay = $row['time_to_play'];
			$gam->mode = $row['mode'];
			$gam->playground = Playground::loadFromDB($row['playground']);
			$gam->buildingList = Building::loadSelectedBuildingsFromGame($gam->gameID);
			$gam->cardList = Card::loadSelectedCardsFromGame($gam->gameID);
			$gam->attendingUsers = User::getUsersInGame($gam->gameID);
			
			return $gam;
		}
		else
			return "e104";
	}
	
	//AUTOR: BIBI
	//gets the name of a mode from the id
	//RETURN VALUE: string mode name
	public static function getModeName($modeID)
	{	$con = db_connect();
		
		$statement = $con->prepare('Select name from mode where mode_id = ?');
		$statement->execute(array($modeID));
		$result = $statement;
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		
		$con = null;
		return $row['name'];
	}
	
	//AUTOR: BIBI
	//looks if a user is currently in a game
	//PARAMETER: $userID - user for the game
	//RETURN VALUE: string gamename
	public static function getGameForUser($userID)
	{	$con = db_connect();
		
		$statement = $con->prepare('SELECT name,game_id from game inner join user_in_game on game = game_id where user = ? and finished is null');
		$statement->execute(array($userID));
		$result = $statement;
		
		$con = null;
		
		if($result->rowCount()>0)
		{	$row = $result->fetch(PDO::FETCH_ASSOC);
			$name=$row['name'];
			$gameID=$row['game_id'];
			
			//check if user has logged out
			$con = db_connect();
		
			$statement = $con->prepare('SELECT * from logger where user = ? and game = ? and text=13');
			$statement->execute(array($userID, $gameID));
			$result = $statement;
			
			$con = null;
			if($result->rowCount()==0)
			{	
				return $name;
			}
			else
			{
				return "e109";
			}
		}
		else
			return "e108";
	}
	//AUTOR: TOM
	//Loads/Calculates the data for returning the current Game Statistics
	/*This Data is: the gameobject with a userlist and each users Statistics */
	//PARAMETER: 
	//RETURN VALUE: Game - or if gameName not to find --> return error code
	//              or game Array
	public function getGameStatistics()
	{
		//The normal user Array is going to be replaced by a userArray with the user-statistics. 
		//After that the normal generateArray-function-logic is going to provide the return value. 
		$buildings = array();
		$cards = array();
		$users = array();
		
		foreach($this->attendingUsers as $user)
			$users[] = $user->generateStatisticsArray($this->gameID);
		
	
		foreach($this->buildingList as $build)
			$buildings[] = $build->generateArray('game');
		
		foreach($this->cardList as $card)
			$cards[] = $card->generateArray();
		
		
		
		$data = array('gameID'=>$this->gameID,'gameName'=>$this->gameName,'creationDate'=>$this->creationDate,'isStarted'=>$this->isStarted,'finished'=>$this->finished,'timeToPlay'=>$this->timeToPlay,'mode'=>array('mode_id'=>$this->mode,'name'=>Game::getModeName($this->mode)),'playground'=>$this->playground->generateArray(false),'buildings'=>$buildings,'users'=>$users,'cards'=>$cards);
		
		return $data;
		
	}
}

?>