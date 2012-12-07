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
	private $gameID; //int
	
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
		if($type=='game')
		{	$data = array('name'=>$this->name,'number'=>$this->number,'fee'=>$this->fee,'buyValue'=>$this->buyValue,'picture'=>$this->picture,'upgradeLevel'=>$this->upgradeLevel,'buildingID'=>$this->buildingID,'location'=>$this->location->generateArray());
			if($this->owner!=null)
				$data['owner']=$this->owner->generateArray();
		}
                
		return $data;
	}
	
	//AUTOR: BIBI
	//saves the instance into the database
	public function saveSelectedBuildingToDB()
	{	$con = db_connect();
	
		$statement = $con->prepare('Insert into selected_building (building,game,buy_value,fee,number,level) values (?,?,?,?,?,?)');
		$statement->execute(array($this->buildingID,$this->gameID,$this->buyValue,$this->fee,$this->number,$this->upgradeLevel));
		
		$con = null;
	}
	
	//AUTOR: BIBI
	//gets a playground ID and loads all Buildings of this playground into the selectedBuilding table
	//generates the number value the fee the buyValue the upgradeLevel 
	//PARAMETER - playground of which all the buildings should be taken
	//RETURN VALUE: BuildingList
	public static function generateSelectedBuildings($pg,$game)
	{	$buildings = Building::getBuildings($pg); //get all buildings of the playground
		
		$rnd = array();
		
		//create the random number array for the buildings to each get an own number (for the dices)
		for($i=2;$i<count($buildings)+2;$i++)
			$rnd[] = $i+1;
			
		shuffle($rnd);
		
		$counter = 0;
		
		foreach($buildings as $building)
		{	$building->upgradeLevel = 0;
			$building->gameID = $game;	
			$building->number = $rnd[$counter];
			$building->buyValue = 1500; //ATTENTION --->> should be calculated on base of the number given!!!!!!! 
			$building->fee = round($building->buyValue*10/100); //with uprgrade lvl 0 --> fee is 10% of buyvalue
			
			$building->saveSelectedBuildingToDB();
			
			$counter ++;
		}
		
		return $buildings;
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