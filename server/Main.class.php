<?php

require_once('Game.class.php');
require_once('User.class.php');
require_once('Log.class.php');
require_once('Type.class.php');
require_once('Playground.class.php');
require_once('database.php');

class Main 
{	//Attributes
	
	private static $currentGame; //instance of Game - current Game
	private static $loggedInUser; //instance of User - the currently logged in user
	private static $logger=array(); //array consisting out of Log instances
	private static $selectedPlayground; //instance of Playground - currently selected Playground
	
	
	//AUTOR: BIBI
	//proves if the LogIn data is valid and if so
	//returns every info about the user + his/her achieved trophies AND
	//an gerneral trophy list (for the client to know when a trophy is achieved during a game)
	//RETURN VALUE: JSON OBJECT
	public static function login($email,$password)
	{	$con = db_connect();
	
		$statement = $con->prepare("Select password, user_id from user where email = ?");
		$statement->execute(array($email));
		$result = $statement;
	
	
		if($result->rowCount()==1) //user mail was correct
		{	$row = $result->fetch(PDO::FETCH_ASSOC);

			if($row['password']==hash('sha256',$password))
				return $row['user_id']; //valid logIn
			else
				return "e103"; //Wrong password
		}
		else //user mail was not correct!!
			return "e102";
	}
	
	//AUTOR: BIBI
	//registers a new user
	//RETURN VALUE: string - error code or OK
	public static function register($email, $password, $username)
	{	$con = db_connect();
	
		if(!is_string($con))
		{	//Step 1 see if mail adress is not already registered
			$statement = $con->prepare("Select * from user where email= ?");
			$statement->execute(array($email));
			$result = $statement;
			
			if($result->rowCount()!=0)//if a result was found --> mail already registered!!
				return "e101";
			else
			{	//if everything is ok then insert
				$query = "Insert into user (email,username,password) values (?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($email,$username,hash('sha256',$password)));
				$id = $con->lastInsertId();
				return "OK";
			}
		}
		else
			return "e100";
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
	{	switch($type)
		{	//AUTOR: BIBI
			case 'register':					$ret = Main::register($obj['email'],$obj['password'],$obj['username']); //call register function
												if($ret != "OK")
													$data = array('type'=>'user','loggedInUser'=>array('error'=>$ret));
												else
													$data = Main::allocateJSON('login',$obj);
												break;
			//AUTOR: BIBI
			case 'login':						$ret = Main::login($obj['email'],$obj['password']);
												if(!is_numeric($ret))
													$data = array('type'=>'user','loggedInUser'=>array('error'=>$ret));
												else
													$data = array('type'=>'user','loggedInUser'=>array('password'=>$obj['password'],'username'=>($obj['username']!=null?$obj['username']:User::getNickname($ret)),'userID'=>$ret,'trophies'=>Main::getTrophies()));
												
												break;
			//AUTOR: BIBI
			case 'loadAllPlaygrounds':			$data = array('type'=>'playground', 'playgrounds' =>Playground::getPlaygrounds());
												break;
			//AUTOR: BIBI
			case 'createGame':					$game = new Game();
												$ret = $game->createNewGame($obj['playgroundID'],$obj['gameName'],$obj['mode'],$obj['timetoplay'],$obj['userID']);
												if($ret == "OK")
													$data = array('type'=>'createdGame','currentGame'=>$game->generateArray());
												else
													$data = array('type'=>'attendGame','currentGame'=>array('error'=>$ret)); 
												break;
			//AUTOR: BIBI
			case 'attendGame':					$game = Game::loadFromDB($obj['game']['gameName']);
												if($game instanceof Game)
												{	Main::$loggedInUser = User::loadFromDB($obj['user']['userID'],'normal');
													$ret = $game->attendGame(Main::$loggedInUser);
													if($ret != 'OK')
														$data = array('type'=>'attendGame','currentGame'=>array('error'=>$ret)); 
													else
														$data = array('type'=>'attendGame','currentGame'=>$game->generateArray());	
												}
												else
													$data = array('type'=>'attendGame','currentGame'=>array('error'=>$game)); 		
												break;
		}
		
		return $data;
	}

	
	//creates a new Log Entry out of the relevant data
	public static function createNewLogEntry()
	{
	}
	
	//AUTOR: BIBI
	//gets a list of all general trophy types and returns them as JSON
	//RETURN VALUE: Type array
	private static function getTrophies()
	{	$con = db_connect();
		
		$result = $con->query("select distinct ty. * from type as ty inner join trophy as t ON t.type = ty.type_id");
		
		$types = array();
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{	$type = new Type();
			$type->color = $row['color'];
			$type->icon = $row['icon'];
			$type->name = $row['name'];
			$type->typeID = $row['type_id'];
				
			$types[] = $type->generateArray();
		}
		return $types;	
	}
	
	 	
}



?>