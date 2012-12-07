<?php

//Location Class represents a location on the map
//could be location for a building, for the ocurrence of a card, etc.
require_once('database.php');

class Location
{	//Attributes
	public $lat; //float latitude
	public $lon; //float longitude
	public $accu; //float accuracy 
	public $locationID; //int 
	
	//AUTOR: BIBI
	//Generates an array of this instance
	//RETURN VALUE: array
	public function generateArray()
	{	$data = array('lat'=>$this->lat,'long'=>$this->lon,'accu'=>$this->accu);
		return $data;
	}
	
	//AUTOR: BIBI
	//saves this instance into the database
	public function saveToDB()
	{	$con = db_connect();
		
		$statement = $con->prepare('Insert into location (lat,lon,radius) values (?,?,?)');
		$statement->execute(array($this->lat,$this->lon,$this->accu));
		
		$this->locationID = $con->lastInsertId();
		$con = null;
	}
	
}

?>