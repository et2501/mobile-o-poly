<?php

require_once('Game.class.php');
require_once('User.class.php');
require_once('Log.class.php');
require_once('Playground.class.php');

class Main 
{	//Attributes
	
	private static $currentGame; //instance of Game - current Game
	private static $loggedInUser; //instance of User - the currently logged in user
	private static $logger=array(); //array consisting out of Log instances
	private static $selectedPlayground; //instance of Playground - currently selected Playground
	
	
	//proves if the LogIn data is valid and if so
	//returns every info about the user + his/her achieved trophies AND
	//an gerneral trophy list (for the client to know when a trophy is achieved during a game)
	//RETURN VALUE: JSON OBJECT
	public static function login()
	{
	}
	
	//gets every info concerning the current game - users, building,...
	//and returns them as a JSON object
	//RETURN VALUE: JSON OBJECT
	public static function updateAll()
	{
	}
	
	//This function parses the Request JSON oject and depending on which type of Request
	//calls the necessary mehtods, functions.... and finally returns a appropriate response JSON object
	//PARAMETERS: string $type - type of request
	//            object $obj - the request JSON object
	//RETURN VALUE: JSON OBJECT
	public static function allocateJSON($type,$obj)
	{
	}
	
	//gets a list of every Playground in database and returns them as JSON
	//RETURN VALUE: JSON OBJECT
	public static function getPlaygrounds()
	{
	}
	
	//creates a new Log Entry out of the relevant data
	public static function createNewLogEntry()
	{
	}
	
	//called from login()
	//gets a list of all general trophies and returns them as JSON
	//RETURN VALUE: JSON OBJECT
	private static function getTrophies()
	{
	}
	
	 	
}



?>