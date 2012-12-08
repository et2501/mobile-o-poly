<?php
//hahaadf
//Card Class represents a card which can be drawn during a game
require_once('database.php');
require_once('Location.class.php');
require_once('Type.class.php');

class Card
{	//Attributes
	private $title; //string - title of the card
	private $text; //string - text of the card
	private $type; //instance of Type - Card Type
	private $occuranceLocation; //instance of Location - Location of occurence
	private $destinationLocation; //instance of Location - If required --> Location of the Destination 
	private $cardID; //string - Card ID
	private $alreadyTriggered;	//bool - was the card already in use or not?
	private $timeToGo; //int - time to go to a specified location
	private $amount; //int - multiplicatior
	private $gameID; //int ID of the game the card belongs to
	
	//GETTERS and SETTERS if required
	
	
	//calculates the time from Location to Location
	//RETURN VALUE: int - time in seconds
	public function calculateTimeForDistance()
	{
	}
	
	//AUTOR: BIBI
	//Generates an array Object of this instance
	//RETURN VALUE: array
	public function generateArray()
	{	$data = array('titel'=>$this->title,'text'=>$this->text,'type'=>$this->type->generateArray(),'cardID'=>$this->cardID,'alreadyTriggered'=>$this->alreadyTriggered,'occuranceLocation'=>$this->occuranceLocation->generateArray(),'gameID'=>$this->gameID,'amount'=>$this->amount);
		if($this->timeToGo!=0)
			$data['timeToGo'] = $this->timeToGo;
		if($this->destinationLocation!=null)
			$data['detinationLocation'] = $this->destinationLocation->generateArray();
		return $data;
	}
	
	//AUTOR: BIBI
	//chooses a certain amount of cards for the game and saves them into database
	//PARAMENTERS: $amount - the amount of cards to be selected
	//			   $game - the game for which the cards should be created
	//NOT TESTED throughoutly <---- ATTENTION
	//RETURN VALUE: array of Card objects
	public static function generateSelectedCards($game,$amount)
	{	$sel_cards = array();
		$card_counter = array(); //this array will prevent that one card can not be chosen more than 3 times!!
		
		//first select all cards available
		$con = db_connect();
		
		$result = $con->query('Select * from card');
		$row = $result->fetchAll(PDO::FETCH_ASSOC);
		
		for($i=0;$i<$amount;$i++)
		{	$ok = false;
			//create a random number between 0 and the number of cards in $row
			$rnd = rand(0,count($row)-1);
			
			//prove if card is already in card_counter
			if(array_key_exists($row[$rnd]['card_id'],$card_counter))//if it exists --> add 1 to value if already three than i-1
			{	if($card_counter[$row[$rnd]['card_id']] < 3)
				{	$card_counter[$row[$rnd]['card_id']] += 1;
					$ok = true;
				}
				else
					$i--;
			}
			else
			{	$card_counter[$row[$rnd]->cardID] = 0;
				$ok = true;
			}
				
			if($ok)
			{	$selCard = new Card();
				$selCard->alreadyTriggered = false;
				$selCard->amount = $row[$rnd]['amount'];
				$selCard->cardID = $row[$rnd]['card_id'];
				$selCard->gameID = $game;
				$selCard->text = $row[$rnd]['text'];
				$selCard->title = $row[$rnd]['titel'];
				
				//ATTENTION OCCURENCE LOCATION MUST GET A VALID VALUE!!!!!!!!!!!!!
				$occ_loc = new Location();
				$occ_loc->accu = 0;
				$occ_loc->lat = 0;
				$occ_loc->lon = 0;
				$occ_loc->saveToDB();
				
				$selCard->occuranceLocation = $occ_loc;
				$selCard->type = Type::loadFromDB($row[$rnd]['type']);
				
				//MISSING destinationLocation and timetogo ---> dependent on card type!!!!!
				//HUGE TODO!!!!!!!!!!!!!!!!! <<-------
				$selCard->timeToGo = 0;
				
				$selCard->saveSelectedCardToDB();
				
				$sel_cards[] = $selCard;
			}
		}
		
		return $sel_cards;
	}
	
	//saves this instance into the database
	public function saveSelectedCardToDB()
	{	$con = db_connect();
	
		if($this->timeToGo==0)
		{	$statement = $con->prepare('Insert into selected_card (card,occurance_location,already_triggered,game_id) values (?,?,?,?)');
			$statement->execute(array($this->cardID,$this->occuranceLocation->locationID,$this->alreadyTriggered,$this->gameID));
		}
		else
		{	$statement = $con->prepare('Insert into selected_card (card,occurance_location,already_triggered,game_id,destination_location,time_for_distance) values (?,?,?,?,?,?)');
			$statement->execute(array($this->cardID,$this->occuranceLocation->locationID,$this->alreadyTriggered,$this->gameID,$this->destinationLocation->locationID,$this->timeToGo));
		}
		
		$con = null;
	}
	
	//AUTOR: BIBI
	//loads all cards for a game
	//PARAMETER: int $gameID - id of the game
	//RETURN VALUE: Card object
	public static function loadSelectedCardsFromGame($gameID)
	{	$cards = array();
		$con = db_connect();
		
		$statement = $con->prepare('Select * from selected_card inner join card on card = card_id inner join location on location_id = occurance_location where game_id = ?');
		$statement->execute(array($gameID));
		$result = $statement;
		
		while($row = $result->fetch(PDO::FETCH_ASSOC))
		{	$card = new Card();
			
			$card->alreadyTriggered = $row['already_triggered'];
			$card->amount = $row['amount'];
			$card->cardID = $row['card_id'];
			$card->gameID =  $row['game_id'];
			$card->text = $row['text'];
			$card->title = $row['titel'];
			$card->type = Type::loadFromDB($row['type']);
			
			$oc_loc = new Location();
			$oc_loc->accu = $row['radius'];
			$oc_loc->lat = $row['lat'];
			$oc_loc->lon = $row['lon'];
			$oc_loc->locationID = $row['location_id'];
			$card->occuranceLocation = $oc_loc;
			
			$card->timeToGo = $row['time_for_distance'];
			
			if($card->timeToGo!=null) //NOT TESTED!!!!
			{	$statement2 = $con->prepare('Select * from location where location_id = ?');
				$statement2->execute(array($row['destination_location']));
				$result2 = $statement2;
				
				$row2 = $result2->fetch(PDO::FETCH_ASSOC);
				
				$d_loc = new Location();
				$d_loc->accu = $row2['radius'];
				$d_loc->lat = $row2['lat'];
				$d_loc->lon = $row2['lon'];
				$d_loc->locationID = $row2['location_id'];
				$card->destinationLocation = $d_loc;
			}
			
			$cards[] = $card;
		}
		
		$con = null;
		return $cards;
	}
	
	public static function loadSelectedCardFromDB($cardID)
	{
	}
}

?>