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
	private $radiusCards=18;
	
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
			$data['destinationLocation'] = $this->destinationLocation->generateArray();
		return $data;
	}
	
	//AUTOR: BIBI
	//chooses a certain amount of cards for the game and saves them into database
	//PARAMENTERS: $amount - the amount of cards to be selected
	//			   $game - the game for which the cards should be created
	//NOT TESTED throughoutly <---- ATTENTION
	//RETURN VALUE: array of Card objects
	
	public static function generateSelectedCards($game,$buildingList)
	{	
		$amount=count($buildingList)*2;
		$sel_cards = array();
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
				{	
					$card_counter[$row[$rnd]['card_id']] += 1;
					$ok = true;
				}
				else
					$i--;
			}
			else
			{	$card_counter[$row[$rnd]['card_id']] = 0;
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
				$selCard->type = Type::loadFromDB($row[$rnd]['type']);
				$selCard->timeToGo = 0;
				
				
				//ATTENTION OCCURENCE LOCATION MUST GET A VALID VALUE!!!!!!!!!!!!!
				
				$distanceOK=false;
				
				while(i<cardCount)
  				{
	  				$building1=$buildingList[rand(0,count($buildingList)-1)];
	  				$building2=$buildingList[rand(0,count($buildingList)-1)];
	  
	  			
					$distanceOK=true;
					if(rand(1,2)==1)
					{
					  //console.log(">0.5");
					  $newlat=($building1->lat+$building2->lat)/2+rand(1,20);
					  $newlong=($building1->long+$building2->long)/2+rand(1,20);
					}
					 
					else
					{
					$newlat=($building1->lat+$building2->lat)/2+rand(1,20);
					$newlong=($building1->long+$building2->long)/2+rand(1,20);
					}
		  
		  
					for($i=0;$i<count($buildingList);$i++)
					{
					  $distanceBTCB=GetDistance($newlat,$newlong,$buildingList[$i]->lat,$buildingList[$i]->long);
				
					  if($distanceBTCB<(20+$radiusCards))
					  {
					
					  $distanceOK=false;
					
					  break;
					  }
					
					}
		
		
		
					if($distanceOK)
					{
						for($j=0;$j<count($sel_cards);$j++)
						{	 
							$distanceBTCard=GetDistance($newlat,$newlong,$sel_cards[$j]->lat,$sel_cards[$j]->long);
							
							if($distanceBTCard<$radiusCards*2)
							{
								$distanceOK=false;
								break;
							}
						}
					  //console.log("card: "+i+" "+newlat+" "+newlong);
					  if($distanceOK)
					  {
						$occ_loc = new Location();
			
						$occ_loc->accu = $radiusCards;
						$occ_loc->lat = $newlat;
						$occ_loc->lon = $newlong;
						
						
						$occ_loc->saveToDB();
						
						if($selCard->type->typeID==15)
						{
							$distance=rand(150,300);
						  $destPoint=getPointAtDistance($newlat,$newlong,$disance,rand(0,360));
						  
						  $dest_loc=new Location();
						  $dest_loc->accu=$radiusCards*2.77; //ergibt 50
						  $dest_loc->lat=$destPoint[0];
						  $dest_loc->lon=$destPoint[1];
						  $selCard->destinationLocation=$dest_loc;
						  
						  $speed=6; //6km/h
						  //man nehme an, man geht mit 6km/h. das wären 6/3.6= 1,666m/s. d.h. wir haben pro s 1,666 meter zu schaffen. 
						  //--> für 500 meter braucht man dann 500/1.666 --> 300sekunden. 
						  $selCard->timeToGo = floor($distance/($speed/3.6));
						}
					  }
					}
				}
				$selCard->occuranceLocation = $occ_loc;
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
	public static function GetDistance($lat1, $lon1, $lat2, $lon2)
	{
		//code for Distance in Kilo Meter
		$theta = $lon1 - $lon2;
		$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
		$dist = abs(round(rad2deg(acos($dist)) * 60 * 1.1515 * 1.609344 * 1000, 0));
		return ($dist);
	}
	
	public static function deg2rad($deg)
	{
		return ($deg * pi() / 180.0);
	}
	
	public static function rad2deg($rad)
	{
		return ($rad / pi()* 180.0);
	}
	
	public static function getPointAtDistance($lat1,$lon1,$dist,$direction)
	{
		$R = 6378.1; //Radius of the Earth
		$brng = deg2rad($direction); //Bearing is 90 degrees converted to radians.
		$d = $dist/1000;//Distance in km
	
		//var lat2  52.20444 //the lat result I'm hoping for
		//var lon2  0.36056 // the long result I'm hoping for.
	
		$lat1 = deg2rad($lat1); //Current lat point converted to radians
		$lon1 = deg2rad($lon1); //Current long point converted to radians
	
		$lat2 = asin( sin($lat1)*cos($d/$R)+cos($lat1)*sin($d/$R)*cos($brng));
	
		$lon2 = $lon1 + atan2(sin($brng)*sin($d/$R)*cos($lat1),cos($d/$R)-sin($lat1)*sin($lat2));
		//$lon2 = $lon1 + atan2((sin($brng)*sin($d/$R)*cos($lat1)),(cos($d/$R)-sin($lat1)*sin($lat2)));
	
		$lat2 = rad2deg($lat2);
		$lon2 = rad2deg($lon2);
		
		return array($lat2,$lon2);
	}

}

?>