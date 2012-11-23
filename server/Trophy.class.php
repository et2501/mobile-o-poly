<?php

//Trophy Class represents a trophy achieved during a game

require_once('Type.class.php');

class Trophy
{	//Attributes
	private $trophyType; //instance of Type - Trophy Type
	private $achievedAt; //instance of DateTime
	private $trophyID; //string - Trophy ID
	private $triggeredAt; //????
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	//RETURN VALUE: JSON OBJECT
	public function generateJSON($type)
	{
	}
	
	//RETURN VALUE: TrophyList
	public static function getUserTrophies($UserID)
	{
	}
	
	
	//RETURN VALUE: TrophyList
	public static function getTrophies()
	{
	}
	
	
	public function saveAchievedTrophyToDB()
	{
	}
	
	
}


?>