<?php

//Location Class represents a location on the map
//could be location for a building, for the ocurrence of a card, etc.

class Location
{	//Attributes
	private $lat; //float latitude
	private $lon; //float longitude
	private $accu; //float accuracy 
	
	
	//Generates a JSON Object of this instance
	//RETURN VALUE: JSON OBJECT
	public function generateJSON()
	{
	}
	
	//saves this instance into the database
	public function saveToDB()
	{
	}
	
}

?>