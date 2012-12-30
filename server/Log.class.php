<?php

//Log Class
require_once('Card.class.php');
require_once('Building.class.php');
require_once('Playground.class.php');
require_once('User.class.php');
require_once('Game.class.php');
require_once('database.php');
require_once('Location.class.php');


class Log
{	//Attributes
	public $user; //instance of User
	private $logID; //int
	private $timestamp; //datetime
	public $Text; //customField
	public $building; //Building
	public $card; //Card
	public $location; //Location
	public $icon; //string
	public $game; //instance of Game
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	
	public function saveToDB()
	{
		$this->timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
		$con = db_connect();
		
		//user, game, timestamp, text, building, card, location, icon
		
		$statement = $con->prepare('Insert into logger (user, game, timestamp, text, building, card, location, icon) values (?,?,?,?,?,?,?,?)');
		$statement->execute(array($this->user->userID,$this->game->gameID,$this->timestamp,$this->Text,$this->building->buildingID,$this->card->cardID,$this->location->locationID, $this->icon));
		
		$id = $con->lastInsertId();
		$con = null;
		return $id;
	}
	
	//RETURN VALUE: array
	public function generateArray()
	{
	}
	
	//RETURN VALUE: LogList
	//may not be necessary to implement
	public static function getLogs($userid=null, $gameName=null)
	{
		if($gameName!=null)
		{
			
		}
	}
	
	//
	
	
	
	
	
}


?>