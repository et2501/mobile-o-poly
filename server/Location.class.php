<?php

//Location Class represents a location on the map
//could be location for a building, for the ocurrence of a card, etc.

class Location
{	//Attributes
	public $lat; //float latitude
	public $lon; //float longitude
	public $accu; //float accuracy 
	
	
	//Generates an array of this instance
	//RETURN VALUE: array
	public function generateArray()
	{	$data = array('lat'=>$this->lat,'long'=>$this->lon,'accu'=>$this->accu);
		return $data;
	}
	
	//saves this instance into the database
	public function saveToDB()
	{
	}
	
}

?>