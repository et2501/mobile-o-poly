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
	public $textID;
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	
	public function saveToDB()
	{
		$date = new DateTime();
		$this->timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
		$con = db_connect();
		
		//user, game, timestamp, text, building, card, location, icon
		$this->user!=null ? $userid=$this->user->getUserID() : $userid=null;
		$this->game!=null ? $gameID=$this->game->getGameID() : $gameID=null;
		$this->building!=null ? $buildingID=$this->building->getBuildingID() : $buildingID=null;
		$this->card!=null ? $cardID=$this->card->getCardID() : $cardID=null;
		
		$statement = $con->prepare('Insert into logger (user, game, timestamp, text, building, card, location, icon) values (?,?,?,?,?,?,?,?)');
		$statement->execute(array($userid,$gameID,$this->timestamp,$this->Text,$buildingID,$cardID,$this->location->locationID, $this->icon));
		
		$id = $con->lastInsertId();
		$con = null;
		return $id;
	}
	
	//AUTOR TOM
	//RETURN VALUE: array
	public function generateArray()
	{	
		$data = array('logID'=>$this->logID,'text'=>$this->Text,'timestamp'=>$this->timestamp, 'textid'=>$this->textID);
		if($this->user!=null)
			$data['user'] = $this->user->generateArray();
		if($this->building!=null)
			$data['building'] = $this->building->generateArray('normal');
		if($this->card!=null)
			$data['card']=$this->card->generateArray();
		if($this->location!=null)
			$data['location']=$this->location->generateArray();
		if($this->icon!=null)
			$data['icon']=$this->icon;
		if($this->game!=null)
			$data['game']=$this->game;
		return $data;
	
	}
	
	//AUTOR: TOM
	//RETURN VALUE: LogList
	//may not be necessary to implement
	public static function getLogs($userid=null, $gameID=null)
	{	$ret = array();
	
		$con = db_connect();
		if($gameID!=null)
		{
				
			$statement = $con->prepare('Select building, user, card, custom_field_id, custom_field.text as fieldtext, icon, logger_id, timestamp, game, radius, lat, lon from logger left join location on logger.location=location.location_id left join custom_field on logger.text=custom_field.custom_field_id where game= ? ORDER BY timestamp DESC');
			$statement->execute(array($gameID));
			$result = $statement;
			
			while($row = $result->fetch(PDO::FETCH_ASSOC))
			{	
				//We need: User, Building, Game, Card, location, 
				//We don't use the game in this context, because it would overload the json.
				$logger=new Log();
				if($row['building'])
					$logger->building=Building::loadSelectedBuildingFromDB($row['building']);
	
				if($row['user'])	
					$logger->user=User::loadFromDB($row['user'],'game');
	
				if($row['card'])
					$logger->card=Card::loadSelectedCardFromDB($row['card']);
	
				
				$logger->Text=$row['fieldtext'];
				$logger->textID=$row['custom_field_id'];
				$logger->icon=$row['icon'];
				$logger->logID=$row['logger_id'];
				$logger->timestamp=$row['timestamp'];
				
				if($row['game'])
					$logger->game=$row['game'];
				
				if($row['lat'])
				{
				  $loc = new Location();
				  $loc->accu = $row['radius'];
				  $loc->lat = $row['lat'];
				  $loc->lon = $row['lon'];
				  $logger->location = $loc;
				}
				
				$ret[] = $logger;
			}
			
			$con = null;
			return $ret;
		}
	}
	
	//
	
	
	
	
	
}


?>