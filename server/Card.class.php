<?php
//hahaadf
//Card Class represents a card which can be drawn during a game

require_once('Location.class.php');
require_once('Type.class.php');

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
	
	//GETTERS and SETTERS if required
	
	
	//calculates the time from Location to Location
	//RETURN VALUE: int - time in seconds
	public function calculateTimeForDistance()
	{
	}
	
	//Generates a JSON Object of this instance
	//RETURN VALUE: JSON OBJECT
	public function generateJSON()
	{
	}
	
	//chooses a certain amount of cards for the game and saves them into database
	//RETURN VALUE: array of Card objects
	public static function generateSelectedCards()
	{
	}
	
	//saves this instance into the database
	public function saveSelectedCardToDB()
	{	
	}
	
	//loads one card from the selected_cards table
	//PARAMETER: int $selectedCardID - id of the card to be fetched
	//RETURN VALUE: Card object
	public static function loadSelectedCardFromDB($selectedCardID)
	{
	}
}

?>