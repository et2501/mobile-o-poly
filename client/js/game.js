//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	var user = JSON.parse(localStorage.getItem('user'));
	console.log(user);
	$('#lbl_menu_nickname').html(user.username);
	
	$('#btn_logout').on('click',function()
		{	localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //an return to login-screen
		});
	
	
	  var currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  console.log(currentGame);
		  
	  //init
	  var lat=51;
	  var lng=0;
	  var map = L.map('map',{zoomControl:false}).setView([lat, lng], 16);
	  var playermarkers=new Array();
	  var buildingMarkerArray=new Array();
	  var cardMarkers=new Array();
	  
	  var walkedDistance=0;
	  var lastKnownPosition;
	  
	  
	  map.zoomControl=false;
	  
	  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		  maxZoom: 18,
	  }).addTo(map);
	  
	  
	  playermarkers[0]=L.circle([lat, lng], 50, {
			 color: 'blue',
			  fillColor: 'blue',
			  fillOpacity: 0.5
	  }).addTo(map).bindPopup("Position");

	  
	  var watchId = navigator.geolocation.watchPosition(
		  function(event){
			  
			  //bisherige Entfernung ausrechnen
			  //
			  if(lastKnownPosition!=null)
			  {
				  walkedDistance+=GetDistance(lastKnownPosition.lat,lastKnownPosition.lon,event.coords.latitude,event.coords.longitude);
			  }
			  
			  lastKnownPosition={'lat':event.coords.latitude, 'lon':event.coords.longitude};
			  console.log(lastKnownPosition.lat,lastKnownPosition.lon);	
			  map.panTo([lastKnownPosition.lat,lastKnownPosition.lon]);	
			  playermarkers[0].setLatLng([lastKnownPosition.lat,lastKnownPosition.lon]);	
			  playermarkers[0].setRadius(event.coords.accuracy);
			  
			  
			  checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.lon);
			  
			  
		  },
		  function(event){
			  console.log(event);	
		  },{maximumAge:6000, timeout:5000, enableHighAccuracy: true}	  
	  );	
	  
	  
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
		  
	  }
	  
	  function updateBuildingmarkers()
	  {
		  for(var building in currentGame.buildings)
		  {
			  buildingMarkerArray.push(L.circle([currentGame.buildings[building].location.lat,currentGame.buildings[building].location.long], currentGame.buildings[building].location.accu, {
			  color: 'red',
			  fillColor: '#f03',
			  fillOpacity: 0.5}));
			  buildingMarkerArray[buildingMarkerArray.length-1].addTo(map).bindPopup("Gebäude");
			  
			  console.log(currentGame.buildings[building].location);
		  }
	  }
	  
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
});




