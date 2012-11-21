<?php

//Game class represents an active game

require_once('Card.class.php');
require_once('Building.class.php');
require_once('Playground.class.php');

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
	
	//GETTERS and SETTERS if required
	
	
	public function createNewGame($pg,$master)
	{
	}
	
	//starts the game
	public function startGame()
	{
	}
	
	//generates a JSON of this instance
	//RETURN VALUE: JSON OBJECT
	public function generateJSON()
	{
	}
	
	//saves this instance into the database
	public function saveToDB()
	{
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