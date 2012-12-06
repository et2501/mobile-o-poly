<?php

//Building Class
require_once('database.php');
require_once('Location.class.php');


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
	
	//AUTOR: BIBI
	//createns an array out of this instance
	//PARAMETER: $type - either 'normal' if a normal building is the object
	//					 or 'game' if an ingame building is the object
	//RETURN VALUE: array
	public function generateArray($type)
	{	if($type=='normal')
			$data = array('name'=>$this->name,'picture'=>$this->picture,'location'=>$this->location->generateArray());
		return $data;
	}
	
	
	public function saveSelectedBuildingToDB()
	{
	}
	
	//RETURN VALUE: BuildingList
	public static function generateBuildings()
	{
	}
	
	
	//RETURN VALUE: Building
	public static function loadSelectedBuildingFromDB($buildingID)
	{
	}
	
	//AUTOR: BIBI
	//gets all building of a specified playground
	//PARAMETER: $playground_id - id of the playground
	//RETURN VALUE: building array
	public static function getBuildings($playground_id)
	{	$ret = array();
	
		$con = db_connect();
		$statement = $con->prepare('Select * from building inner join location on location_id = location where playground_id = ?');
		$statement->execute(array($playground_id));
		$result = $statement;
		
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{	$build = new Building();
			$build->buildingID = $row['building_id'];
			$build->name = $row['name'];
			$build->picture = $row['picture'];
			
			$loc = new Location();
			$loc->accu = $row['radius'];
			$loc->lat = $row['lat'];
			$loc->lon = $row['long'];
			$build->location = $loc;
			
			$ret[] = $build;
		}
		
		$con = null;
		return $ret;
	}
	
}


?>