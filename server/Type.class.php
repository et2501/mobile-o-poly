<?php

//Class Type - represents either a Card or a Trophy type
require_once('database.php');

class Type
{	//Attributes
	public $typeID; 
	public $name;
	public $color;
	public $icon;
	
	//AUTOR: BIBI
	//creates an array out of this instance
	//RETURN VALUE: Array of the instance
	public function generateArray()
	{	$ret = array('typeID'=>$this->typeID,'name'=>$this->name,'color'=>$this->color,'iconURL'=>$this->icon);
		return $ret;
	}
	
	//AUTOR: BIBI
	//loads one type from database
	//PARAMENTERS: $typeID - id of the type to fetch
	//RETURN VALUE: instance of type
	public static function loadFromDB($typeID)
	{	$typ = new Type();
		$con = db_connect();
	
		$statement = $con->prepare('Select * from type where type_id = ?');
		$statement->execute(array($typeID));
		$result = $statement;
		
		$row = $result->fetch(PDO::FETCH_ASSOC);
		
		$typ->color = $row['color'];
		$typ->icon = $row['icon'];
		$typ->name = $row['name'];
		$typ->typeID = $typeID;
	
		$con = null;
		return $typ;
	}
	
	
	
}


?>