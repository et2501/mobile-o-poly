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
	  var walkedDistance=0; 
	  lastKnownPosition={'lat':0, 'long':0, 'accu':0};
	  lastPositionupdate=null;
			 
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
	
	
	  
	  
	  
	  
	  
	  
	  //icons
	  var playerIcon = L.icon({
		  iconUrl: './assets/images/player.png',
		  shadowUrl: './assets/images/player_shadow.png',
	  
		  iconSize:     [26, 24], // size of the icon
		  shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [13, 24], // point of the icon which will correspond to marker's location
		  shadowAnchor: [8, 29],  // the same for the shadow
		  popupAnchor:  [-0, -20] // point from which the popup should open relative to the iconAnchor
		});
		
		var playerIconEveryone = L.icon({
		  iconUrl: './assets/images/player_everyone.png',
		  shadowUrl: './assets/images/player_shadow.png',
	  
		  iconSize:     [26, 24], // size of the icon
		  shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [13, 24], // point of the icon which will correspond to marker's location
		  shadowAnchor: [8, 29],  // the same for the shadow
		  popupAnchor:  [-0, -20] // point from which the popup should open relative to the iconAnchor
		});
		
		var buildingIcon=L.icon({
		iconUrl: './assets/images/building.png',
		  shadowUrl: './assets/images/building_shadow.png',
	  
		  iconSize:     [20, 24], // size of the icon
		  shadowSize:   [35, 30], // size of the shadow
		  iconAnchor:   [10, 24], // point of the icon which will correspond to marker's location
		  shadowAnchor: [10, 29],  // the same for the shadow
		  popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
		});
	  
	  
	  
	  
	  
	  map.zoomControl=false;
	  
	  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		  maxZoom: 18,
	  }).addTo(map);
	  
	  
	  playermarkers[user.userID]=L.marker([lat, lng], {icon: playerIcon}).addTo(map);
		
	  /*
		  Es gibt folgende methoden: 
		  
		  void navigator.geolocation.getCurrentPosition(success_callback_function, error_callback_function, position_options)
		  long navigator.geolocation.watchPosition(success_callback_function, error_callback_function, position_options)
		  (deshalb long, weil eine id zurückkommt, die man für die nächste Methode braucht)
		  void navigator.geolocation.clearWatch(watch_position_id)
	  
		  Folgende Position-options gibt es: 
		  enableHighAccuracy – Eine boolean (true/false), die dem Gerät anweist, die genauestmögliche Position zu ermitteln (von Cell-of-Origin z.b. auf GPS switchen)
		  maximumAge – Das maximale Alter(in Millisekunden), die der zuletzt upgedatete Eintrag alt sein darf (manche Geräte cachen die Einträge, um Energie zu sparen)
		  timeout – Die Zeit, die zum Abrufen der Position zur Verfügung steht. Bei Timeout kommt man ins onError
	  */
	  
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
				  walkedDistance+=GetDistance(lastKnownPosition.lat,lastKnownPosition.lon,event.coords.latitude,event.coords.longitude);
			  }
			  checkForSpeedingTicket(event.coords.speed);
			  lastPositionUpdate=event.coords.timestamp;
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
		  },{maximumAge:6000, timeout:5000, enableHighAccuracy: true}	  
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
		  }
	  }
	  
	  function updateBuildingmarkers()
	  {
		  buildingMarkerArray=new Array()
		  for(var building in currentGame.buildings)
		  {
			  buildingMarkerArray.push(L.marker([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], {icon: buildingIcon}));
			  buildingMarkerArray[buildingMarkerArray.length-1].addTo(map).bindPopup(currentGame.buildings[building].name);	
			  		  
		  }
	  }
	  
	  function checkwalkedDistanceEvent(walkedDistance)
	  {
	  }
	  
	  function checkForSpeedingTicket(speed)
	  {
		  
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
			
			  
			lastKnownPosition={'lat':debuglat, 'long':debuglon, 'accu':0};
			checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);
		
		},50);  
	  }
	  
});

var debuglat=0;
var debuglon=0;
function simulatePosition(lat, lon)
{
	debuglat=lat;
	debuglon=lon;
}


