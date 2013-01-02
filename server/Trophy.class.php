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
	
	
	//RETURN VALUE: Array OBJECT
	public function generateArray($type)
	{
		$data = array('trophyID'=>$this->trophyID,'achievedAt'=>$this->achievedAt, 'triggeredAt'=>$this->triggeredAt, 'trophyType'=>$this->trophyType->generateArray());
		return $data;
	}
	
	//AUTOR: BIBI
	//fetches all achieved trophies for a user
	//PARAMETER: $userID - id of the user for which the trophies should be fetched
	//RETURN VALUE: TrophyList
	public static function getUserTrophies($userID)
	{	$con = db_connect();

		$statement = $con->prepare("Select at.achieved_at as ATachievedAt, at.achieved_trophy_id ast ATTrophyID, t.type as TType, t.triggered_at as TTriggeredAt from achieved_trophy as at inner join trophy as t on t.trophy_id = at.trophy where at.user = ?");
		$statement->execute(array($userID));
		$result = $statement;
		
		$con = null; //close connection
		
		if($result->rowCount()!=0)
		{	$trophies = array();
			while($row = $result->fetch(PDO::FETCH_ASSOC))
			{	$troph = new Trophy();
				$troph->achievedAt = $row['ATachievedAt'];
				$troph->trophyID = $row['ATTrophyID'];
				$troph->triggeredAt = $row['TTriggeredAt'];
				$troph->trophyType = Type::loadFromDB($row['TType']);
				
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