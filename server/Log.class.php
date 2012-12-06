<?php

//Log Class



class Log
{	//Attributes
	private $user; //instance of User
	private $logID; //int
	private $timestamp; //datetime
	private $Text; //customField
	private $building; //Building
	private $card; //Card
	private $location; //Location
	private $icon; //string
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	
	public function saveToDB()
	{
	}
	
	//RETURN VALUE: array
	public function generateArray()
	{
	}
	
	
	//RETURN VALUE: LogList
	public static function getStatistics($type, $userid, $gameName)
	{
	}
	
	
	
	
	
}


?>