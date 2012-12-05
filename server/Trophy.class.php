<?php

//Trophy Class represents a trophy achieved during a game

require_once('Type.class.php');

class Trophy
{	//Attributes
	private $trophyType; //instance of Type - Trophy Type
	private $achievedAt; //instance of DateTime
	private $trophyID; //int - Trophy ID
	private $triggeredAt; //????
	
	//GETTERS and SETTERS (Setters if needed?)
	
	
	//RETURN VALUE: JSON OBJECT
	public function generateJSON($type)
	{
	}
	
	//AUTOR: BIBI
	//fetches all achieved trophies for a user
	//PARAMETER: $userID - id of the user for which the trophies should be fetched
	//RETURN VALUE: TrophyList
	public static function getUserTrophies($userID)
	{	$con = db_connect();
		
		$query = "Select at.achieved_at, at.achieved_trophy_id, t.type, t.triggered_at from achieved_trophy as at inner join trophy as t on t.trophy_id = at.trophy where at.user = ?";
		$statement = $con->prepare($query);
		$statement->execute(array($userID));
		$result = $statement;
		
		$con = null; //close connection
		
		if($result->rowCount()!=0)
		{	$trophies = array();
			while($row = $result->fetch(PDO::FETCH_ASSOC))
			{	$troph = new Trophy();
				$troph->achievedAt = $row['at.achieved_at'];
				$troph->trophyID = $row['at.achieved_trophy_id'];
				$troph->triggeredAt = $row['t.triggered_at'];
				$troph->trophyType = $row['t.type'];
				
				$trophies[] = $troph;
			}
			return $trophies;
		}
		else
			return array();
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