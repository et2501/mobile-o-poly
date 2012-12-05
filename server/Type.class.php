<?php

//Class Type - represents either a Card or a Trophy type


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
	
	
	
}


?>