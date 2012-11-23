<?php

//Building Class



class Building
{	//Attributes
	private $name; //string
	private $number; //int
	private $owner; //User
	private $fee; //int
	private $buyValue; //int
	private $picture; //string
	private $location; //Location
	private $upgradeLevel; //int
	private $buildingID; //int
	private $newField; //int
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	
	public function buyBuilding($User)
	{
	}
	
	
	public function rentBuilding($User)
	{
	}
	
	
	public function upgradeBuilding()
	{
	}
	
	
	//RETURN VALUE: JSON Object
	public function generateJSON()
	{
	}
	
	
	public function saveSelectedBuildingToDB()
	{
	}
	
	//RETURN VALUE: BuildingList
	public static function generateBuildings()
	{
	}
	
	
	//RETURN VALUE: Building
	public static function loadSelectedBuildingFromDB($gameID)
	{
	}
	
	
	
}


?>