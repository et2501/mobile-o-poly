<?php
//haha
//Card Class represents a card which can be drawn during a game

require_once('Location.class.php');
require_cone('Type.class.php');

class Card
{	//Attributes
	private $title; //string - title of the card
	private $text; //string - text of the card
	private $type; //instance of Type - Card Type
	private $occuranceLocation; //instance of Location - Location of occurence
	private $destinationLocation; //instance of Location - If required --> Location of the Destination 
	private $cardID; //string - Card ID
	private $alreadyTriggered;	//bool - was the card already in use or not?
	private $timeToGo; //THOMAS FRAGEN!!
	
	//GETTERS and SETTERS ??
	
	
	//FUNCTIONS
	
	//returns the time in seconds - int
	public function calculateTimeForDistance()
	{
	}
	
	//Generates a JSON Object of this class
	//returns the finished JSON Object
	public function generateJSON()
	{
	}
	
	//returns an instance of Card
	public function generateSelectedCard()
	{
	}
}

?>