<?php

//class Playground represents one Playground to play on

class Playground
{	//Attributes
	private $name; //string - name of Playground
	private $moneyToGo; //int - Money which is earned after walking a specified distance
	private $startingMoney; //int - Starting Money of every Player
	private $buildingList = array(); //array of Building instances - all the Buildings which belong to this playground
	private $playgroundID; //int - ID of this Playground
	private $maxPlayers; //int - maximum number of players
	
	//GETTERS and SETTERS if needed
	
	//fetches all Playgrounds out of the database and returns them in an array
	//RETURN VALUE: array of Playgrounds
	public static function getPlaygrounds()
	{
	}
	
	//creates a JSON out of this instance
	//RETURN VALUE: JSON OBJECT
	public function generateJSON()
	{
	}
	
	//fetches all Buildings for this Playground
	//RETURN VALUE: array of Buildings
	public function getBuildings()
	{
	}
	
	//loads one Playground object from the database
	//PARAMETER: int $playgroundID - id of the database entry
	//RETURN VALUE: Playground
	public static function loadFromDB($playgroundID)
	{
	}
}


?>