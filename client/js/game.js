//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	  
	  //init
	  var debug=false; 														//If Debug=true, marker for buildings can be displayed and a position can be simulated
	  var lat=48.2045;															//startinglatitude
	  var lng=15.6229;															//startinglongitude
	  var map = L.map('map',{zoomControl:false}).setView([lat, lng], 16); 	//leaflet-map
	  var buildingMarkerArray=new Array();									//This contains the Buildingmarkers
	  var cardMarkers=new Array();											//This contains the cardmarkers (if debug=true)
	  var playermarkers=new Array();										//This contains the playermarkers				
	  
	  var user = JSON.parse(localStorage.getItem('user'));					//this contains the user object	(loaded from localStorage)
	  var currentGame=JSON.parse(localStorage.getItem('currentGame'));		//this contains the game object (loaded from localStorage)
	  var playground=JSON.parse(localStorage.getItem('playground'));		//this contains the playground  (loaded from localStorage)
	  
	  var walkedDistance=0;													//contains the distance that a user has walked in the current Game
	  var walkedDistanceSinceMoney=0; 										//this contains the distance that the user has walked since he got the last money
	  var lastKnownPosition=null;        									//this contains the last known position, in the format: {'lat':0, 'long':0, 'accu':0};
	  var lastPositionUpdate=new Date();									//this timestamp is needed for the calculations of the speeding ticket
	  var maxSpeed=15;														//max Speed before a user gets a ticket (in km/h)
	 
	  var gameStopped=false;												//is true if the game has been stopped
	  
	  var destinations=[{
	  	'location':{
		'lat':0, 'long':0, 'accu':0
		},
		'object':null
	  }];	 																//should contain an array of the destinations,
	  																		//the object is either a building, a destination location.
																			//if the object is null, no destination marker should be displayed!
																			//also a discount can be stored in this object! 
	  var destinationMarker=null;											//this contains the destination marker
	  
	  map.zoomControl=false;												//maaap
	  
	  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		  maxZoom: 18,
	  }).addTo(map);														//maaaap
	  
	   playermarkers[user.userID]=L.marker([lat, lng], {icon: playerIcon}).addTo(map);
	 
	  //simulatePosition(lat,lng);
	  //zum anschaun der objekte 
	  //console.log(user);
	  //console.log(currentGame);
	
	//only for testing
	$('#lbl_menu_nickname').html(user.username);
	
	
	
	
	//AUTOR: TOM
	//LogoutButton, an admin has to stop the game before he can log himself out. 
	//after that the logout request is dispatched. 
	$('#btn_logout').on('click',function()
		{	
			if(user.userRole=="admin"&&currentGame.finished==null)
			{
				alert("Sie müssen das Spiel beenden, um sich ausloggen zu können!");
			}
			else
			{
				sendReqLogout(user.userID, currentGame.gameID);
			}
		});
	
	$('#btn_logout').on('click',function()
		{	
			if(user.userRole=="admin"&&currentGame.finished==null)
			{
				alert("Sie müssen das Spiel beenden, um sich ausloggen zu können!");
			}
			else
			{
				sendReqLogout(user.userID, currentGame.gameID);
			}
		});	
	
	//AUTOR: TOM
	//StopButton, this can only be pressed by the admin	
	//The request is dispatched and the game in the localstorage is renewed. 
	//There has to be something implemented. maybe displaying the log. 
	$('#btn_dice').on('click',function()
		{	
			
			//if(destinations[destinations.length-1].object==null)
			//{
				
				result=quickAndDirtyDice(currentGame.buildings.length,6);
				destinationBuilding=getBuildingByNumer(result);
				alert(destinationBuilding.name);
				//destinations[destinations.length].object=new Array();
				destinations.push({'location':{'lat':destinationBuilding.location.lat, 'long':destinationBuilding.location.long, 'accu':destinationBuilding.location.accu},'object':destinationBuilding});	 		
				
				/*Dice.animate(function () {
					var result=Dice.init(currentGame.buildings.length,0);
					alert(destinationBuilding.name);
       			
    				});*/
			//}
			
			
		});
		
	function quickAndDirtyDice(buildings,currentbuilding)
	{	var number=getRandomInt(3,16);
		while(number==currentbuilding)
		{
			number=getRandomInt(3,16);
		}
		return number;
	}
	function getRandomInt (min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}  
	  function getBuildingByNumer(number)
	  {
		   for(var building in currentGame.buildings)
		  {
			  //Radius zwischen Karte und Position < 18
			  //can be changed to currentGame.buildings[building].location.accu
			  if(currentGame.buildings[building].number==number)
			  {
				  return currentGame.buildings[building];
			  }
		  }
	  }
	  //AUTOR: TOM
	  //Geolocation
	  var watchId = navigator.geolocation.watchPosition(
		  function(event){
			  
			  //bisherige Entfernung ausrechnen
			  //
			  if(lastKnownPosition!=null)
			  {
				  var lastDistance=GetDistance(lastKnownPosition.lat,lastKnownPosition.lon,event.coords.latitude,event.coords.longitude);
				  walkedDistance+=lastDistance;
				  walkedDistanceSinceMoney+=lastDistance;
				  checkwalkedDistanceEvent(walkedDistance);
			  }
			  
			  //
			  checkForSpeedingTicket(event.coords.latitude,event.coords.longitude,event.coords.speed,event.timestamp);
			  
			  lastPositionUpdate=event.timestamp;
			  
			  //last known position is updated
			  lastKnownPosition={'lat':event.coords.latitude, 'long':event.coords.longitude, 'accu':event.coords.accuracy};	
			  map.panTo([lastKnownPosition.lat,lastKnownPosition.long]);								//map is focusing on the last known position
			  playermarkers[user.userID].setLatLng([lastKnownPosition.lat,lastKnownPosition.long]);		//the playermarker with the corresponding userID is updatet
			  checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);						//look for buildings or cards in range
			  //updatePlayermarkers();																	//every marker is updated. 
			  
			  
		  },
		  function(event){
			  //Error-Callback-Funktion
			  console.log(event);	
		  },{maximumAge:6000, timeout:15000, enableHighAccuracy: true}	  
	  );
	  
	  //AUTOR: TOM
	  //interval for the updateAll - loop
	  var updateInterval=window.setInterval(function()
	  	{
			if(!lastKnownPosition)
			{	//If the lastknownPosition is not set, a update all with no coordinates is dispatched. 
				sendRequpdateAll(user.userID, 0,0, 0, walkedDistance, currentGame.gameID);
			}
			else
			{
				sendRequpdateAll(user.userID, lastKnownPosition.lat,lastKnownPosition.long, lastKnownPosition.accu, walkedDistance, currentGame.gameID);
			}
			
			
			//the user and game object are renewed after the UpdateAllRequest
			user = JSON.parse(localStorage.getItem('user'));
	 		currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  
	  		//
			
			updateBuildingmarkers();
			updatePlayermarkers();
			//The userRole is only available after the first updateAll!
			if(user.userRole=="admin")
			{
				$('#btn_stop').show();
			}
			
			
			if(currentGame.finished!=null)
			{
			  //Was kommt jetzt????
			  alert("Spiel beendet!");
			  window.clearInterval(updateInterval);			//The updateAll loop is cleared
			  navigator.geolocation.clearWatch(watchId);	//the geolocation watchposition is cleared. 
			  //localStorage.removeItem('currentGame');		//
			  //localStorage.removeItem('playground');		//
			}
		},5000); 
		
	  //AUTOR: TOM
	  //check for cards or buildings in range
	  function checkPositionEvents(lat,lon)
	  {
		  //karte kann gezogen werden wenn ma nirgends hin muss oder wenn ma zu einem gebäude muss aber nicht, wenn eine karte eingetragen ist
		  var checkCard=false;
		  
		  //wenn ein Nutzer nicht zu einem Gebäude oder irgendeinem Ziel muss
		  if(destinations[destinations.length-1].object==null)
		  {
			  checkCard=true;
		  }
		  //Wenn das objekt nicht leer is muss unterschieden werden
		  if(destinations[destinations.length-1].object!=null)
		  {
			  //ist darin keine cardID enthalten, darf eine karte gezogen werden.  
			  if(!destinations[destinations.length-1].object.cardID)
			  {
				   checkCard=true;
			  }
			  
			   //ist dort drin eine karte drin muss auch was passieren:
			   if(destinations[destinations.length-1].object.cardID)
			   {
				   //reachedDestination
					if(GetDistance(lat,lon,destinations[destinations.length-1].lat,destinations[destinations.length-1].long)<destinations[destinations.length-1].accu)
					{
						raiseCardEvent(currentGame.cards[card]);
					}
			   }
			   if(destinations[destinations.length-1].object.cardID.buildingID)
			   {
				    raiseBuildingEvent(destinations[destinations.length-1].object.cardID.buildingID);
			   }
			  
		  }
		  if(checkCard)
		  {
			  for(var card in currentGame.cards)
			  {
				  
				  //Radius zwischen Karte und Position < 18
				  //can be changed to currentGame.cards[card].occuranceLocation.accu
				  if(GetDistance(lat,lon,currentGame.cards[card].occuranceLocation.lat,currentGame.cards[card].occuranceLocation.long)<18&&currentGame.cards[card].alreadyTriggered==0)
				  {
					  raiseCardEvent(currentGame.cards[card]);
				  }
			  }
		  }		  
	  }
	  
	  
	  //AUTOR: TOM
	  //draw the playermarkers on the map
	  function updatePlayermarkers()
	  {
		  
		  //remove every marker from the map in order to draw them on the map
		  for(var marker in playermarkers)
		    map.removeLayer(playermarkers[marker]);
		  
		  playermarkers=new Array();
		  //loop for drawing the playermarkers
		  for(var curUser in currentGame.users)
		  {
			  if(user.userID!=currentGame.users[curUser].userID)
			  {
				  //playerIconEveryone
				  playermarkers[curUser]=L.marker([currentGame.users[curUser].lastKnownPosition.lat, currentGame.users[curUser].lastKnownPosition.long], {icon: playerIconEveryone}).addTo(map);
				  playermarkers[curUser].addTo(map).bindPopup(currentGame.users[curUser].username);
			  }
			  if(user.userID==currentGame.users[curUser].userID)
			  {
				  if(lastKnownPosition)
				  {
					//playerIcon only myself
					playermarkers[curUser]=L.marker([lastKnownPosition.lat, lastKnownPosition.long], {icon: playerIcon}).addTo(map);
					playermarkers[curUser].addTo(map).bindPopup(currentGame.users[curUser].username);
				  }
			  }
		  }
		  
		  //the destinationmarker should be removed if it is set
		  if(destinationMarker)
		  {
			   map.removeLayer(destinationMarker); 
		  }
		 	
		  //The destinationmarker is drawn on the map
		  if(destinations[destinations.length-1].object!=null)
		  {
			  destinationMarker=L.circle([destinations[destinations.length-1].location.lat,destinations[destinations.length-1].location.long], destinations[destinations.length-1].location.accu, {
			  color: 'blue',
			  fillColor: '#03f',
			  fillOpacity: 0.2});
			  destinationMarker.addTo(map).bindPopup("Dein Ziel");
		  }
		  
		  /*if(debug)
		  {
			  displayCardmarkers();
		  }*/
	  }
	  
	  
	  //AUTOR: TOM
	  //draw the cardmarkers on the map - this is a debug function
	  function displayCardmarkers()
	  {
		  for(var marker in cardMarkers)
		  {
			  map.removeLayer(cardMarkers[marker]);
		  }
		  cardMarkers=new Array();
		  for(var card in currentGame.cards)
		  {
			  cardMarkers.push(L.circle([currentGame.cards[card].occuranceLocation.lat,currentGame.cards[card].occuranceLocation.long], currentGame.cards[card].occuranceLocation.accu, {
			  color: 'red',
			  fillColor: '#f03',
			  fillOpacity: 0.5}));
			  cardMarkers[cardMarkers.length-1].addTo(map).bindPopup(currentGame.cards[card].text);
			  
			  
			  if(currentGame.cards[card].destinationLocation)
			  {
				  cardMarkers.push(L.circle([currentGame.cards[card].destinationLocation.lat,currentGame.cards[card].destinationLocation.long], currentGame.cards[card].destinationLocation.accu, {
			  	color: 'red',
			  fillColor: '#903',
			  fillOpacity: 0.5}));
			  cardMarkers[cardMarkers.length-1].addTo(map).bindPopup(currentGame.cards[card].text);
			  
			  }
		  }
	  }
	  
	  
	  //AUTOR: TOM
	  //draw the cardmarkers on the map - this is a debug function
	  function updateBuildingmarkers()
	  {
		  //remove every marker from the map in order to draw them on the map
		  for(var marker in buildingMarkerArray)
			  map.removeLayer(buildingMarkerArray[marker]);
		  
		  buildingMarkerArray=new Array();
		  
		   //loop for drawing the buildingmarkers
		  for(var building in currentGame.buildings)
		  {
			  if(!currentGame.buildings[building].owner)
			  {
				  //Gebäude gehört niemandem
				  buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIcon}));
				  buildingMarkerArray[buildingMarkerArray.length-1].addTo(map).bindPopup(currentGame.buildings[building].name);	
			  }
			  else
			  {		//Gebäude gehört irgendwem
			  		//Wem gehört das Gebäude?
				  var owner=currentGame.buildings[building].owner;
				  if (owner.userID==user.userID)
				  {
					  switch(currentGame.buildings[building].upgradeLevel)
					  {
						  //upgradelevel of the building
						  case '0':
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI0}));
				  				break;
						  case '1':
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI1}));
						  		break;
						  case '2':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI2}));				   
						  		break;
						  case '3':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI3}));
						  		break;
						  case '4':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI4}));				   
						  		break;
						  default:
						  		console.log( currentGame.buildings[building].upgradeLevel);
						  		break;
					  }
					 
				  }
				  else
				  {
					  switch(currentGame.buildings[building].upgradeLevel)
					  {
						  case '0':
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE0}));
						  		break;
						  case '1':
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE1}));
						  		break;
						  case '2':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE2}));				   
						  		break;
						  case '3':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE3}));
						  		break;
						  case '4':
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE4}));				   
						  		break;
						  default:
						  		console.log("someone else: "+currentGame.buildings[building].upgradeLevel);
						  		break;
					  } 
				  }
				  //add a popup to the buildingmarker
				  buildingMarkerArray[buildingMarkerArray.length-1].addTo(map).bindPopup(currentGame.buildings[building].name+" <br /> gehört: "+owner.username);
			  }
			  		  
		  }
	  }
	  
	  
	  updateBuildingmarkers();
	  updatePlayermarkers();
	  
	  //AUTOR: TOM
	  //check if the user can get money for walking a specific distance
	  function checkwalkedDistanceEvent(walkedDistance)
	  {
		  if(walkedDistanceSinceMoney>500)
		  {
			  walkedDistanceSinceMoney=0;
			  sendReqMoneyToGo(user.userID, currentGame.gameID, playground.playgroundID);
		  }
	  }
	  
	  //AUTOR: TOM
	  //Checks if the user has to get a speeding ticket. 
	  function checkForSpeedingTicket(lat, lon, speed, time)
	  {
		  //Speed from the geolocation api comes in m/s, so it has to be converted to km/h
		  if(speed*3.6>maxSpeed)
		  {		
			  raiseSpeedingTicket();
		  }
		  
		  
		  //if the speed object is not available or not accurate enough (some devices may or may not have speed not implemented)
		  //time in secons
		  var walkedTime=(time-lastPositionUpdate)/1000; 
		  //distance in meter
		  if(lastKnownPosition)	
			  var walkedDistanceS=GetDistance(lat, lon, lastKnownPosition.lat,lastKnownPosition.long);
		  
		  //if the calculated Speed is over the maxSpeed
		  if(walkedDistanceS/walkedTime*3.6>maxSpeed)
		  {
			  console.log("calculatedSpeed: "+walkedDistanceS/walkedTime*3.6+"kmh");
			  console.log("distance: "+walkedDistanceS+", Time: "+walkedTime);
			  raiseSpeedingTicket();
		  }		  
	  }
	  
	  //AUTOR: TOM
	  //raises a speeding ticket
	  function raiseSpeedingTicket()
	  {
		  sendReqSpeedTicket(user.userID, currentGame.gameID);
		  user = JSON.parse(localStorage.getItem('user'));
		  console.log("user got speeding ticket");
	  }
	    
	  
	  //Mathematische Berechnungsformeln
	  //AUTOR: unknown, changed by TOM
	  //calculate the distance between to Coordinates
	  function GetDistance(lat1, lon1, lat2, lon2)
	  {
        //code for Distance in Kilo Meter
        var theta = lon1 - lon2;
        var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = Math.abs(Math.round(rad2deg(Math.acos(dist)) * 60 * 1.1515 * 1.609344 * 1000, 0));
        return (dist);
	  }
	  
	  //AUTOR: unknown, changed by TOM
	  //
	  function deg2rad(deg)
	  {
		  return (deg * Math.PI / 180.0);
	  }
	  
	  //AUTOR: unknown, changed by TOM
	  //
	  function rad2deg(rad)
	  {
		  return (rad / Math.PI * 180.0);
	  }
	  
	  //AUTOR: 
	  //
	  function raiseCardEvent(card)
	  {
		  console.log("function has to be implemented");
	  }
	  
	  //AUTOR: MARCUS
	  //
	  function raiseBuildingEvent(building)
	  { 
	  	  if(!building.owner) {
		  		  		
		  	if(user.money >= building.buyValue) {
		  		
		  		sendReqBuyBuilding(user.userID, currentGame.gameID, building.buildingID);
		  		//user = JSON.parse(localStorage.getItem('user'));
		  		
		  	}
		  	
		  }
		  if(building.owner)
		  {
			  if(building.owner.userID==user.userID)
			  {
				  if(user.money >= building.buyValue*0.25) {
					  sendReqUpgradeBuilding(user.userID, currentGame.gameID, building.buildingID);
				  }
			  }
			  else
			  {
				  if(user.money >= building.fee) {
					  sendReqRentBuilding(user.userID, building.owner.userID, currentGame.gameID, building.buildingID);
				  }
				  else
				  {
					  bankrupt();
				  }
			  }
		  }
		  
	  }
	  
	  function bankrupt()
	  {
		  console.log("bankrott noch nicht implementiert");
	  }
	  //Debugging functions
	  if(debug)
	  {
		//a destination object is made
		destinations[0].location=currentGame.buildings[0].location;
		destinations[0].object=currentGame.buildings[0];
		 
		//this interval is for -getting the global debug values into this anonymous function 
		var debugInterval=window.setInterval(function()
	  	{
			checkForSpeedingTicket(debuglat,debuglon,0,debugtime);				//debug 		  
			lastKnownPosition={'lat':debuglat, 'long':debuglon, 'accu':0};		//
			lastPositionUpdate=debugtime;										//
			checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);	//

		},2000);  
	  }
	  
	  
});

var debuglat=48.2045;
var debuglon=15.6229;	
var debugtime=new Date();
//AUTOR: TOM
//debug function, which is accessible from the browser-console
function simulatePosition(lat, lon)
{
	debugtime=new Date();
	debuglat=lat;
	debuglon=lon;
}

