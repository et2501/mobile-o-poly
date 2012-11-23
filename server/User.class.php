<?php

//User Class



class User
{	//Attributes
	private $lastKnownPosition; //Location
	private $Money; //int
	private $currentGame; //Game
	private $userRole; //int
	private $email; //string
	private $color; //string
	private $username; //string
	private $UserID; //int
	private $achievedTrophies; //TrophyList
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	//RETURN VALUE: User
	public static function loadFromDB($userID)
	{
	}
	
	
	public function saveToDB()
	{
	}
	
	
	//RETURN VALUE: JSON Object
	public function generateJSON()
	{
	}
	
	
	public function getAchievedTrophies()
	{
	}
	
	
	public function rolledDice($number)
	{
	}
	
	
	
}


?>