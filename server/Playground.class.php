<?php

//class Playground represents one Playground to play on
require_once('Building.class.php');
require_once('database.php');

class Playground
{	//Attributes
	private $name; //string - name of Playground
	private $moneyToGo; //int - Money which is earned after walking a specified distance
	private $startingMoney; //int - Starting Money of every Player
	private $buildingList = array(); //array of Building instances - all the Buildings which belong to this playground
	private $playgroundID; //int - ID of this Playground
	private $maxPlayers; //int - maximum number of players
	
	//GETTERS and SETTERS if needed
	//AUTOR: BIBI
	public function getID()
	{	return $this->playgroundID;
	}
	
	public function getStartMoney()
	{	return $this->startingMoney;
	}
	
	public function getMaxPlayers()
	{	return $this->maxPlayers;
	}
	
	//AUTOR: BIBI
	//fetches all Playgrounds out of the database and returns them in an array
	//RETURN VALUE: array of Playgrounds
	public static function getPlaygrounds()
	{	$ret = array();
	
		$con = db_connect();
		
		$result = $con->query('Select * from playground');
		
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{	$pg = new Playground();
			$pg->fillIntoObject($row);
			$ret[] = $pg->generateArray(true);
		}
		
		$con = null;
		return $ret;
	}
	
	//AUTOR: BIBI
	//creates an array out of this instance
	//PARAMETER: $building - bool true if array should be with the building false if not
	//RETURN VALUE: array 
	public function generateArray($building)
	{	if($building)
		{	$buildings = array();
		
			foreach($this->buildingList as $build)
				$buildings[] = $build->generateArray('normal');
		
		
			$data = array('name'=>$this->name,'moneyToGo'=>$this->moneyToGo,'startingMoney'=>$this->startingMoney,'playgroundID'=>$this->playgroundID,'maxPlayers'=>$this->maxPlayers,'buildings'=>$buildings);
		}
		else
			$data = array('name'=>$this->name,'moneyToGo'=>$this->moneyToGo,'startingMoney'=>$this->startingMoney,'playgroundID'=>$this->playgroundID,'maxPlayers'=>$this->maxPlayers);
			
		return $data;
	}
	
	//AUTOR: BIBI
	//loads one Playground object from the database
	//PARAMETER: int $playgroundID - id of the database entry
	//RETURN VALUE: Playground
	public static function loadFromDB($playgroundID)
	{	$pg = new Playground();
		
		$con = db_connect();
	
		$statement = $con->prepare('Select * from playground where playground_id = ?');
		$statement->execute(array($playgroundID));
		$result = $statement;
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		$pg->fillIntoObject($row);
	
		$con = null;
		return $pg;
	}
	
	//AUTOR: BIBI
	//fills all the results into the object
	//PARAMETER: $row - the resultset 
	private function fillIntoObject($row)
	{	$this->name = $row['name'];
		$this->moneyToGo = $row['money_to_go'];
		$this->maxPlayers = $row['maxPlayers'];
		$this->startingMoney = $row['starting_money'];
		$this->playgroundID = $row['playground_id'];
		$this->buildingList = Building::getBuildings($this->playgroundID);
	}
	
}


?>