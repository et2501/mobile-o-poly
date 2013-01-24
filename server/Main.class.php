<?php

require_once('Game.class.php');
require_once('User.class.php');
require_once('Log.class.php');
require_once('Type.class.php');
require_once('Playground.class.php');
require_once('database.php');
require_once('Location.class.php');
require_once('Building.class.php');
require_once('Card.class.php');

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
			{
				//logentry 4 --> login
				$userid=$row['user_id'];
				$logentry=new Log();
				$logentry->user=User::loadFromDB($userid,'normal');
				$logentry->Text='4';
				$logentry->saveToDB();
				
				return $userid; //valid logIn
				
				
			}
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
				
				
				//logentry 5 --> register
				$logentry=new Log();
				$logentry->user=User::loadFromDB($id,'normal');
				$logentry->Text='5';
				$logentry->saveToDB();
				
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
													$data = array('type'=>'user','loggedInUser'=>array('email'=>$obj['email'],'password'=>$obj['password'],'username'=>($obj['username']!=null?$obj['username']:User::getNickname($ret)),'userID'=>$ret,'trophies'=>Main::getTrophies()));
												
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
			//AUTOR: BIBI
			case 'checkStartedGame':			$game = Game::loadFromDB($obj['game']['gameName'],$obj['game']['gameID']);
												if($game instanceof Game)
													$data = array('type'=>'checkStartedGame','currentGame'=>$game->generateArray());
												else
													$data = array('type'=>'checkStartedGame','currentGame'=>array('error'=>$game));
												break;
		  //AUTOR: BIBI
		  case 'startGame':						$game = Game::loadFromDB($obj['game']['gameName'],$obj['game']['gameID']);
		  										if($game instanceof Game)
												{	$game->startGame();
													$data = array('type'=>'checkStartedGame','currentGame'=>$game->generateArray());
												}
												else
													$data = array('type'=>'checkStartedGame','currentGame'=>array('error'=>$game));
		  										break;
			//AUTOR: BIBI
			case 'isUserInGame':				$gamename = Game::getGameForUser($obj['user']['userID']);
												if($gamename != "e108"&&$gamename!="e109")
												{	$game = Game::loadFromDB($gamename);
													if($game instanceof Game)
														$data = array('type'=>'userGame','currentGame'=>$game->generateArray());
													else
														$data = array('type'=>'userGame','currentGame'=>array('error'=>$game));
												}
												else
													$data = array('type'=>'userGame','currentGame'=>array('error'=>$gamename));
												break;
			//AUTOR: TOM
			case 'loadGlobalStatistics': 		
												$user=User::loadFromDB($obj['user']['userID'],"normal");
												if($user instanceof User)
													$data=array('type'=>'loadGlobalStatistics','loggedInUser'=>$user->generateStatisticsArray());
												else
													$data = array('type'=>'loadGlobalStatistics','loggedInUser'=>array('error'=>$user));
												
												break;
												
			//AUTOR: TOM
			case 'loadGameStatistics': 			
												$game= Game::loadFromDB('',$obj['game']['gameID']);
												
													if($game instanceof Game)
														$data = array('type'=>'loadGameStatistics','currentGame'=>$game->getGameStatistics());
													else
														$data = array('type'=>'loadGameStatistics','currentGame'=>array('error'=>$game));												
												break;
			//AUTOR: TOM
			case 'updateLog': 					
												if(isset($obj['game']['gameID']))
												{
													$loglist=Log::getLogs(null, $obj['game']['gameID']);
													$logData=array();
													foreach($loglist as $log)
														$logData[] = $log->generateArray();
														
													$data = array('type'=>'updateLog','log'=>$logData);	
												}
												else
												{
													$data = array('type'=>'updateLog','log'=>'error');
													//TODO has to be implemented
												}
												
												break;
			//AUTOR: TOM									
			case 'logout':						
												//logentry 13 --> logout
												$logentry=new Log();
												$logentry->user=User::loadFromDB($obj['user']['userID'],'normal');
												if($logentry->user instanceof User)
												{
												  $logentry->Text='13';
												  $logentry->game=Game::loadFromDB('',$obj['game']['gameID']);
												  if($logentry->game instanceof Game)
												  {
													  
													  $BuildingList=Building::loadSelectedBuildingsFromUserInGame($logentry->user->getUserID(),$logentry->game->getGameID());
													  foreach($BuildingList as $building)
														$building->resetBuilding();
													  
													  $logentry->saveToDB();
													
													$data = array('type'=>'logout','success'=>$logentry->game);
												  }
												  else
												  {
													  $data = array('type'=>'logout','success'=>array('error'=>'e999'));
												  }
												}
												else
												{
													$data = array('type'=>'logout','success'=>array('error'=>'e999'));
												}
												break;
			case 'updateAll': 					
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												//new last known position, 
												//then complete user inkl trophies, currentgame, complete log,
												if($currentuser instanceof User)
												{
													$newLoc=new Location();
													$newLoc->lat=$obj['user']['lastknownPosition']['lat'];
													$newLoc->lon=$obj['user']['lastknownPosition']['long'];
													$newLoc->accu=$obj['user']['lastknownPosition']['accu'];
													$newLoc->saveToDB();
													$currentuser->lastKnownPosition=$newLoc;
													$currentuser->distanceWalked=$obj['user']['distanceWalked'];
													//money wird hier nicht verändert, damit der user nicht "schummeln" kann. Aber wer würd das schon machen ;) 
													
													$currentuser->changeUserUpdateAll($obj['game']['gameID']);
													$currentuser->getAchievedTrophies();
													$currentgame= Game::loadFromDB('',$obj['game']['gameID']);
													if($currentgame instanceof Game)
													{
													  $data = array('type'=>'updateAll','loggedInUser'=>$currentuser->generateArray(), 'currentGame'=>$currentgame->generateArray());
													}
													else
													{
													  $data = array('type'=>'updateAll','loggedInUser'=>$currentuser->generateArray(), 'currentGame'=>array('error'=>$currentgame));	
													}
												}
												else
													$data = array('type'=>'updateAll','loggedInUser'=>array('error'=>$currentuser));
												
												break;
			case 'SpeedTicket':					
												$currentuser=User::loadFromDB($obj['user']['userID'],'game', $obj['game']['gameID']);
												if($currentuser instanceof User)
												{
												  $currentuser->gotSpeedingTicket();
												  $currentuser->changeUserInGameInDB( $obj['game']['gameID']);
												  $data=array('type'=>'SpeedTicket','loggedInUser'=>$currentuser->generateArray());
												}
												else
													$data = array('type'=>'SpeedTicket','loggedInUser'=>array('error'=>$currentuser));
												break;
			case 'MoneyToGo':														
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{	
													$game = Game::loadFromDB('',$obj['game']['gameID']);
													if($game instanceof Game)
													{
														$playground=$game->getPlayground();
													$currentuser->money=$currentuser->money+$playground->getMoneyToGo();
													$currentuser->changeUserInGameInDB($obj['game']['gameID']);
													$data=array('type'=>'MoneyToGo','loggedInUser'=>$currentuser->generateArray());
													}
													else
													{
														$data = array('type'=>'MoneyToGo','loggedInUser'=>array('error'=>$game));
													}
												
												}
												else
													$data = array('type'=>'MoneyToGo','loggedInUser'=>array('error'=>$currentuser));
												
												break;
			case 'changeNick':					
												$ret = Main::login($obj['user']['email'],$obj['user']['password']);
												if(!is_numeric($ret))
													$data = array('type'=>'changeNick','loggedInUser'=>array('error'=>$ret));
												else
												{
													$currentuser=User::loadFromDB($ret,'normal');
													if($currentuser instanceof User)
													{
														$currentuser->setNickname($obj['user']['username']);
														$currentuser->saveUserToDB();
														$data = array('type'=>'changeNick','loggedInUser'=>$currentuser->generateArray());
													}
													else
													{		
														$data = array('type'=>'changeNick','loggedInUser'=>array('error'=>'e999'));	
													}
														
												}
												break;
			//AUTOR: Tom									
			case 'BuyBuilding':					
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{
												
													$building = Building::loadSelectedBuildingFromDB($obj['building']['buildingID']);
													
														if($building instanceof Building)
														{
															if($building->owner==null)
															{
																$currentuser=$building->buyBuilding($currentuser);
																$game = Game::loadFromDB('',$obj['game']['gameID']);
																if($game instanceof Game)
																{
																	$logentry=new Log();
																	$logentry->Text='1';
																	$logentry->user=$currentuser;
																	$logentry->game=$game;
																	$logentry->building=$building;
																	$logentry->saveToDB();
																	
																$data = array('type'=>'BuyBuilding','loggedInUser'=>$currentuser->generateArray(),'currentgame'=>$game->generateArray());
																}
																else
																{
																	$data=array('type'=>'BuyBuilding','error'=>$game);	
			
																}
															}
															else
															{
															  $data = array('type'=>'BuyBuilding','loggedInUser'=>$currentuser->generateArray());
															}
															
														}
														else
														{
															$data=array('type'=>'BuyBuilding','error'=>$building);
														}
													
												}
												else
												{
													$data=array('type'=>'BuyBuilding','error'=>$currentuser);	
												}
												
												break;
			case 'UpgradeBuilding':					
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{
												
													$building = Building::loadSelectedBuildingFromDB($obj['building']['buildingID']);
													
														if($building instanceof Building)
														{
															if($building->owner->getUserID()==$currentuser->getUserID())
															{
																if($currentuser->money>=($building->getBuyValue()*0.25))
																{
																	$oldLevel=$building->getLevel();
																	$building->upgradeBuilding();
																	if($oldLevel<$building->getLevel())
																	{
																		$currentuser->money=$currentuser->money-($building->getBuyValue()*0.25);
																		$currentuser->changeUserInGameInDB($building->getGameID());
																	}
																}
																$game = Game::loadFromDB('',$obj['game']['gameID']);
																
																if($game instanceof Game)
																{
																	
																		$logentry=new Log();
																		$logentry->Text='3';
																		$logentry->user=$currentuser;
																		$logentry->game=$game;
																		$logentry->building=$building;
																		$logentry->saveToDB();
																		
																	$data = array('type'=>'UpgradeBuilding','loggedInUser'=>$currentuser->generateArray(),'currentgame'=>$game->generateArray());
																}
																else
																{
																	$data=array('type'=>'UpgradeBuilding','error'=>$game);	
																}
															}
															else
															{
															  $data = array('type'=>'BuyBuilding','loggedInUser'=>$currentuser->generateArray());
															}
															
														}
														else
														{
															$data=array('type'=>'UpgradeBuilding','error'=>$building);
														}
													
													
												}
												else
												{
													$data=array('type'=>'UpgradeBuilding','error'=>$currentuser);	
												}
												
												break;											
			case 'RentBuilding':					
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{
													$ownerUser=User::loadFromDB($obj['building']['ownerID'],'game',$obj['game']['gameID']);
													if($ownerUser instanceof User)
													{
													$building = Building::loadSelectedBuildingFromDB($obj['building']['buildingID']);
													
														if($building instanceof Building)
														{
															
																if($currentuser->money>=$building->getFee())
																{
																	$currentuser->money=$currentuser->money-$building->getFee();
																	$ownerUser->money=$ownerUser->money+$building->getFee();
																	$currentuser->changeUserInGameInDB($building->getGameID());
																	$ownerUser->changeUserInGameInDB($building->getGameID());
																}
																$game = Game::loadFromDB('',$obj['game']['gameID']);
																
																		$logentry=new Log();
																		$logentry->Text='2';
																		$logentry->user=$currentuser;
																		$logentry->game=$game;
																		$logentry->building=$building;
																		$logentry->saveToDB();
																		
																
																
																if($game instanceof Game)
																{
																	$data = array('type'=>'RentBuilding','loggedInUser'=>$currentuser->generateArray(),'currentgame'=>$game->generateArray());
																}
																else
																{
																	$data=array('type'=>'RentBuilding','error'=>$game);	
																}
															
															
														}
														else
														{
															$data=array('type'=>'RentBuilding','error'=>$building);
														}
													}
													
													
												}
												else
												{
													$data=array('type'=>'RentBuilding','error'=>$currentuser);	
												}
												
												break;											
																																						
			case 'StopGame':														
												
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
													if($currentuser instanceof User)
													{
														if($currentuser->getUserRole()=='admin')
														{
															$currentgame=Game::loadFromDB('',$obj['game']['gameID']);
															if($currentgame instanceof Game)
															{						
																$currentgame->stopGame();									
																$logentry=new Log();
																$logentry->Text='15';
																$logentry->user=$currentuser;
																$logentry->game=$currentgame;
																$logentry->saveToDB();
																
																$data = array('type'=>'StopGame','loggedInUser'=>$currentuser->generateArray(), 'currentGame'=>$currentgame->generateArray());
															}
															else
															{
																$data = array('type'=>'StopGame','loggedInUser'=>array('error'=>'e108'));
															}
														}
														else
														{
															$data = array('type'=>'StopGame','loggedInUser'=>array('error'=>'e110'));
														}
													}
													else
													{
														$data = array('type'=>'StopGame','loggedInUser'=>array('error'=>'e999'));
													}
													
													
												break;
				case 'userGotCard':				$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{
												$game = Game::loadFromDB('',$obj['game']['gameID']);
												if($game instanceof Game)
												{	
														$card = Card::loadSelectedCardFromDB($obj['card']['selectedCardID']);
														if($card instanceof Card)
														{
															//playground for starting money
															$playground=$game->getPlayground();
															if($card->getAlreadyTriggered()==0)
															{
																
																  switch($card->type->typeID)
																  {
																	  case 12:
																	  case 15: 
																			  //raise money	
																			  $currentuser->money+=$card->getAmount()*$playground->getMoneyToGo();
																			  $card->setAlreadyTriggered();
																			  $card->changeSelectedCardInDB();
																			  break;
																	  case 13: 
																			  //loosemoney
																			  $currentuser->money-=$card->getAmount()*$playground->getMoneyToGo();
																			  $card->setAlreadyTriggered();
																			  $card->changeSelectedCardInDB();
																			  break;
																  }
																  $currentuser->changeUserInGameInDB($game->getGameID());
																  //neu laden vom game, damit die card upgedated drin is. 
																  $game = Game::loadFromDB('',$obj['game']['gameID']);
																  
																  
																		$logentry=new Log();
																		$logentry->Text='10';
																		$logentry->user=$currentuser;
																		$logentry->game=$game;
																		$logentry->card=$card;
																		$logentry->saveToDB();
																		
																  
																  $data = array('type'=>'userGotCard','loggedInUser'=>$currentuser->generateArray(),'currentgame'=>$game->generateArray());

																}
																else
																{
																	$data=array('type'=>'userGotCard','loggedInUser'=>array('error'=>'card2','card'=>$card));	
																}
															}
															else
															{
															  $data = array('type'=>'userGotCard','loggedInUser'=>array('error'=>'card1','card'=>$card));
															}
															
														}
														else
														{
															$data=array('type'=>'userGotCard','loggedInUser'=>array('error'=>'game','game'=>$game));
														}
													
													
												}
												else
												{
													$data=array('type'=>'userGotCard','loggedInUser'=>array('error'=>'user','data'=>$currentuser));	
												}
															
				
												break;	
				case 'bankrupt': 				
												$currentuser=User::loadFromDB($obj['user']['userID'],'game',$obj['game']['gameID']);
												if($currentuser instanceof User)
												{
													$game = Game::loadFromDB('',$obj['game']['gameID']);
													if($game instanceof Game)
													{
														$BuildingList=Building::loadSelectedBuildingsFromUserInGame($currentuser->getUserID(),$game->getGameID());
													  	foreach($BuildingList as $building)
															$building->resetBuilding();
														
														$currentuser->money=0;
														$currentuser->changeUserInGameInDB($game->getGameID());
														
														$logentry=new Log();
														$logentry->Text='12';
														$logentry->user=$currentuser;
														$logentry->game=$game;
														$logentry->saveToDB();
														
														$game = Game::loadFromDB('',$obj['game']['gameID']);
														if($game instanceof Game)
														{
																$data = array('type'=>'bankrupt','loggedInUser'=>$currentuser->generateArray(),'currentgame'=>$game->generateArray());
	
														}
														else
														{
																$data=array('type'=>'bankrupt','loggedInUser'=>array('error'=>'game','game'=>$game));
														}	
													}
													else
													{
															$data=array('type'=>'bankrupt','loggedInUser'=>array('error'=>'game','game'=>$game));
													}
												}
												else
												{
													$data=array('type'=>'bankrupt','loggedInUser'=>array('error'=>'user','data'=>$currentuser));	
												}
												
				
												break;															
				default:						
												$data=array('type'=>'error','error'=>'cant process command');
												break;

												
		}
		
		return $data;
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