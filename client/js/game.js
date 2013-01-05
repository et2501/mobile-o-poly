//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	  var debug=true;
	  //init
	  var lat=51;
	  var lng=0;
	  var map = L.map('map',{zoomControl:false}).setView([lat, lng], 16);
	  var playermarkers=new Array();
	  var buildingMarkerArray=new Array();
	  var cardMarkers=new Array();
	  var user = JSON.parse(localStorage.getItem('user'));
	  var currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  var playground=JSON.parse(localStorage.getItem('playground'));
	  var walkedDistance=0;
	  var walkedDistanceSinceMoney=0; 
	  var lastKnownPosition={'lat':0, 'long':0, 'accu':0};
	  var lastPositionUpdate=new Date();
	  var maxSpeed=25;
			 
	  //zum anschaun der objekte 
	  //console.log(user);
	  //console.log(currentGame);
	
	
	
	$('#lbl_menu_nickname').html(user.username);
	
	$('#btn_logout').on('click',function()
		{	
			sendReqLogout(user.userID, currentGame.gameID);
			localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //an return to login-screen
		});
	
	  map.zoomControl=false;
	  
	  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		  maxZoom: 18,
	  }).addTo(map);
	  
	  
	  playermarkers[user.userID]=L.marker([lat, lng], {icon: playerIcon}).addTo(map);
			  
	  var watchId = navigator.geolocation.watchPosition(
		  function(event){
			  
			  //Success-Callback-Funktion
			  
			  //Hier gibt es folgende Elemente:
			  //coords.latitude – Die derzeitige Latitude
			  //coords.longitude – Die derzeitige Longitude
			  //coords.accuracy – Die Genauigkeit der Position in Meter
			  //coords.speed – Die Geschwindigkeit in Meter/Sekunde (um auf km/h zu kommen muss man dieses mit 3.6 multiplizieren
			  //coords.heading - Richtung, in die man sich bewegt, in Grad, beginnend Norden im Uhrzeigersinn
			  //coords.altitude – Die Altitude (Höhe) in Meter
			  //coords.altitudeAccuracy – Die Genauigkeit der Altitude
			  //timestamp
			  
			   
			  //bisherige Entfernung ausrechnen
			  //
			  if(lastKnownPosition!=null)
			  {
				  var lastDistance=GetDistance(lastKnownPosition.lat,lastKnownPosition.lon,event.coords.latitude,event.coords.longitude);
				  walkedDistance+=lastDistance;
				  walkedDistanceSinceMoney+=lastDistance;
			  }
			  
			  checkForSpeedingTicket(event.coords.latitude,event.coords.longitude,event.coords.speed,event.timestamp);
			  
			  lastPositionUpdate=event.timestamp;
			  
			  //eventuell das ganze coords in LastKnownPosition speicher, um zu verhindern, dass 
			  //das checkForSpeedingTicket ausgehebelt wird. 
			  lastKnownPosition={'lat':event.coords.latitude, 'long':event.coords.longitude, 'accu':event.coords.accuracy};
			  console.log("position updated:" +lastKnownPosition.lat,lastKnownPosition.long);	
			  map.panTo([lastKnownPosition.lat,lastKnownPosition.long]);	
			  playermarkers[user.userID].setLatLng([lastKnownPosition.lat,lastKnownPosition.long]);	
			  checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);
			  
			updatePlayermarkers();
			  
			checkwalkedDistanceEvent(walkedDistance);
			  
		  },
		  function(event){
			  //Error-Callback-Funktion
			  console.log(event);	
		  },{maximumAge:6000, timeout:15000, enableHighAccuracy: true}	  
	  );
	  
	  var updateInterval=window.setInterval(function()
	  	{
			sendRequpdateAll(user.userID, lastKnownPosition.lat,lastKnownPosition.long, lastKnownPosition.accu, walkedDistance, currentGame.gameID);
			
			//console.log(localStorage.getItem('user'));
			user = JSON.parse(localStorage.getItem('user'));
	 		currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  
			updatePlayermarkers();

		},5000);
	  	
	  
	  
	  updateBuildingmarkers();
	  updatePlayermarkers(); 
	  
	  
	  function checkPositionEvents(lat,lon)
	  {
		  for(var card in currentGame.cards)
		  {
			  //Radius zwischen Karte und Position < 18
			  if(GetDistance(lat,lon,currentGame.cards[card].occuranceLocation.lat,currentGame.cards[card].occuranceLocation.long)<18&&currentGame.cards[card].alreadyTriggered==0)
			  {
				  raiseCardEvent(currentGame.cards[card]);
			  }
		  }
		  for(var building in currentGame.buildings)
		  {
			  //Radius zwischen Karte und Position < 18
			  if(GetDistance(lat,lon,currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long)<25)
			  {
				  raiseBuildingEvent(currentGame.buildings[building]);
			  }
		  }
		  
	  }
	  
	  
	  
	  function updatePlayermarkers()
	  {
		  
		  for(var marker in playermarkers)
		  {
			  //console.log("removed "+marker+" from ");
			  //console.log(playermarkers);
			  map.removeLayer(playermarkers[marker]);
		  }
		  for(var curUser in currentGame.users)
		  {
			 
			  
			  if(user.userID!=currentGame.users[curUser].userID)
			  {
				  //playerIconEveryone
				   //console.log(currentGame.users[curUser].userID + " "+currentGame.users[curUser].username+" "+ user.userID+" someone else");
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
		  
		  if(debug)
		  {
			  displayCardmarkers();
		  }
	  }
	  
	  function displayCardmarkers()
	  {
		  for(var marker in cardMarkers)
		  {
			  //console.log("removed "+marker+" from ");
			  //console.log(playermarkers);
			  map.removeLayer(cardMarkers[marker]);
		  }
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
	  
	  function updateBuildingmarkers()
	  {
		  buildingMarkerArray=new Array()
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
					  switch(currentGame.buildings[building].level)
					  {
						  case 0:
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI0}));
						  		break;
						  case 1:
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI1}));
						  		break;
						  case 2:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI2}));				   
						  		break;
						  case 3:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI3}));
						  		break;
						  case 4:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconI4}));				   
						  		break;
						  default:
						  		console.log("error");
						  		break;
					  }
					 
				  }
				  else
				  {
					  switch(currentGame.buildings[building].level)
					  {
						  case 0:
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE0}));
						  		break;
						  case 1:
						  	buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE1}));
						  		break;
						  case 2:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE2}));				   
						  		break;
						  case 3:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE3}));
						  		break;
						  case 4:
							buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIconE4}));				   
						  		break;
						  default:
						  		console.log("error");
						  		break;
					  } 
				  }
				  buildingMarkerArray[buildingMarkerArray.length-1].addTo(map).bindPopup(currentGame.buildings[building].name+" <br /> gehört: "+owner.username);
			  }
			  		  
		  }
	  }
	  
	  
	  
	  function checkwalkedDistanceEvent(walkedDistance)
	  {
		  if(walkedDistanceSinceMoney>500)
		  {
			  walkedDistanceSinceMoney=0;
			  //User has to get money;
			  sendReqMoneyToGo(user.userID, currentGame.gameID, playground.playgroundID);
		  }
	  }
	  
	  
	  
	  
	  
	  //Mathematische Berechnungsformeln
	  
	  function GetDistance(lat1, lon1, lat2, lon2)
	  {
        //code for Distance in Kilo Meter
        var theta = lon1 - lon2;
        var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
        dist = Math.abs(Math.round(rad2deg(Math.acos(dist)) * 60 * 1.1515 * 1.609344 * 1000, 0));
        return (dist);
	  }
	  
	  function deg2rad(deg)
	  {
		  return (deg * Math.PI / 180.0);
	  }
	  
	  function rad2deg(rad)
	  {
		  return (rad / Math.PI * 180.0);
	  }
	  
	  
	  function raiseCardEvent(card)
	  {
		  console.log("function has to be implemented");
	  }
	  
	  function raiseBuildingEvent(card)
	  {
		  console.log("function has to be implemented");
	  }
	  
	  
	  
	  if(debug)
	  {
		var debugInterval=window.setInterval(function()
	  	{
			checkForSpeedingTicket(debuglat,debuglon,0,debugtime);			  
			lastKnownPosition={'lat':debuglat, 'long':debuglon, 'accu':0};
			lastPositionUpdate=debugtime;
			checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);

		},500);  
	  }
	  
	  function checkForSpeedingTicket(lat, lon, speed, time)
	  {
		  if(speed*3.6>maxSpeed)
		  {
			  console.log(" Speed: "+speed);
			  raiseSpeedingTicket();
		  }
		  
		  
		  //jetzt noch falls speed nicht verfügbar is		 
		   //Zeit in sekunden
		  var walkedTime=(time-lastPositionUpdate)/1000; 
			//Weg in Meter
		  var walkedDistanceS=GetDistance(lat, lon, lastKnownPosition.lat,lastKnownPosition.long);
		  
		  
		  if(walkedDistanceS/walkedTime*3.6>maxSpeed)
		  {
			  console.log("calculatedSpeed: "+walkedDistanceS/walkedTime*3.6+"kmh");
			  console.log("distance: "+walkedDistanceS+", Time: "+walkedTime);
			  raiseSpeedingTicket();
		  }
		  //floor($distance/($speed/3.6));

		  
	  }
	  function raiseSpeedingTicket()
	  {
		  sendReqSpeedTicket(user.userID, currentGame.gameID);
		  user = JSON.parse(localStorage.getItem('user'));
		  console.log("user got speeding ticket");
	  }
	  
});

var debuglat=0;
var debuglon=0;
var debugtime=new Date();

function simulatePosition(lat, lon)
{
	debugtime=new Date();
	debuglat=lat;
	debuglon=lon;
}


