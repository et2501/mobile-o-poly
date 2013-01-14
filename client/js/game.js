
//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	  
	  //init
	  var debug=true; 														//If Debug=true, marker for buildings can be displayed and a position can be simulated
	  var lat=48.204867;
      var lng=15.626733;															//startinglongitude
	  var map = L.map('map',{zoomControl:false}).setView([lat, lng], 16); 	//leaflet-map
	  var buildingMarkerArray=new Array();									//This contains the Buildingmarkers
	  var cardMarkers=new Array();											//This contains the cardmarkers (if debug=true)
	  var playermarkers=new Array();										//This contains the playermarkers				
	  
	  var user = JSON.parse(localStorage.getItem('user'));					//this contains the user object	(loaded from localStorage)
	  
	  var currentGame=JSON.parse(localStorage.getItem('currentGame'));		//this contains the game object (loaded from localStorage)
	  var playground=JSON.parse(localStorage.getItem('playground'));		//this contains the playground  (loaded from localStorage)
	  
													//contains the distance that a user has walked in the current Game
	  var walkedDistanceSinceMoney=0; 										//this contains the distance that the user has walked since he got the last money
	  var lastKnownPosition=null;        									//this contains the last known position, in the format: {'lat':0, 'long':0, 'accu':0};
	  var lastPositionUpdate=new Date();									//this timestamp is needed for the calculations of the speeding ticket
	  var maxSpeed=15;														//max Speed before a user gets a ticket (in km/h)
	 
	  var gameStopped=false;												//is true if the game has been stopped
	  var counterActionCard;
	  var time;
	  var lastDice=0;
	  var logs;
	  
	  var destinations;
	  if(!localStorage.getItem('destinations'))
	  {
		  	
	  		destinations=[{
	  				'location':{
					'lat':0, 'long':0, 'accu':0
					},
					'object':null
	  		}];	 
	  }
	  else
	  {
		  destinations=JSON.parse(localStorage.getItem('destinations'));
	  }																		//should contain an array of the destinations,
	  																		//the object is either a building, a destination location.
		$('#usr_name').html(user.username);																	//if the object is null, no destination marker should be displayed!
																			//also a discount can be stored in this object! 
	  var destinationMarker=null;											//this contains the destination marker
	  
	  map.zoomControl=false;												//maaap
	  
	  L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		  maxZoom: 18,
	  }).addTo(map);														//maaaap
	  
	   playermarkers[user.userID]=L.marker([lat, lng], {icon: playerIcon}).addTo(map);
	   updateHUD();
	 
	 function updateHUD()
	 {
		 $('#lbl_time').html('');
		 
		 $('#lbl_walkedDistance').html(user.distanceWalked);
		 $('#lbl_money').html(user.money);
	 }
	 
	
		  Dice.init(currentGame.buildings.length, 0, {
				animate : true,
				debug : true, 
				diceFaces : 6,
				diceSize: 100,  // px
				diceCls : {     // class names
					box : 'diceBox', 
					cube : 'diceCube',
					face : 'face',
					side : 'side'
				},
				wrapper : 'diceHolder', // parent element
				xRange : [0, 20],  // min and max turns in x axis
				yRange : [0, 20],  // min and max turns in y axis
			});	 

	document.getElementById('btn_rolldice').addEventListener('click', function () {
		$('#btn_rolldice').attr('disabled','disabled');
		// you can optionally pass a call back to animate()!
		var result = Dice.animate();
		
		var destinationBuilding=null;
		var foundBuilding=false;
		
		
		while(!foundBuilding)
		{
				destinationBuilding=getBuildingByNumer(result);
				if(destinationBuilding!=null&&lastDice!=result)
				{
					
					foundBuilding=true;
				}
				else
				{
					result=Dice.animate();
				}
		}
		lastDice=result;
			//alert(destinationBuilding.name);
			//destinations[destinations.length].object=new Array();
			destinations[destinations.length]={'location':{'lat':destinationBuilding.location.lat, 'long':destinationBuilding.location.long, 'accu':destinationBuilding.location.accu},'object':destinationBuilding};	 		
		   localStorage.setItem('destinations',JSON.stringify(destinations));
		   setTimeout(function(){
			 $('#modalWuerfeln').modal('toggle');
			 $('#lbl_diceBuilding').html(destinationBuilding.name);
			 $('#lbl_diceNumber').html(result);
			 $('#lbl_diceCoordinates').html(destinationBuilding.location.lat+'N, '+destinationBuilding.location.long+'O');
			 $('#btn_rolldice').removeAttr('disabled');
			 $('#modalWuerfeln2').modal('toggle');
			 
		   },3500);

	});
	
   //$('#modalWuerfeln').modal({backdrop:'static'});
   if(destinations[destinations.length-1].object==null)
   {
   		$('#modalWuerfeln').modal('toggle');
   }
	  
	  //zum anschaun der objekte 
	  //console.log(user);
	  //console.log(currentGame);
	
	//only for testing
	$('#lbl_menu_nickname').html(user.username);
	
	
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
		  return null;
	  }
	  
	
	//AUTOR: TOM
	//LogoutButton, an admin has to stop the game before he can log himself out. 
	//after that the logout request is dispatched. 
	$('#btn_logout').on('click',function()
		{	
			if(user.userRole=="admin"&&currentGame.finished==null)
			{
				hideAllModals();
				$('#modalStopGame').modal('toggle');
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
	$('#btn_stop').on('click',function()
		{	
			sendReqStopGame(user.userID, currentGame.gameID);
			currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  		
			if(currentGame.finished!=null)
			{
			  
			  //Was kommt jetzt????
			  gameStopped=true;
			 hideAllModals();
				$('#modalLogout').modal('toggle');
			  //localStorage.removeItem('currentGame');
			  //localStorage.removeItem('playground');
			}
			
		});
		
		
		$('#btn_buyBuilding').on('click',function(){
	  		sendReqBuyBuilding(user.userID, currentGame.gameID, $('#hidden_building_id_buy').val());
			if(typeof JSON.parse(localStorage.getItem('currentGame')).gameID!='undefined')
			{
				currentGame=JSON.parse(localStorage.getItem('currentGame'));
				updateBuildingmarkers();
			}
		  	//user = JSON.parse(localStorage.getItem('user'));
		  		
			//$('#modalKaufen').modal('toggle');	
			hideAllModals(); 		
			$('#modalWuerfeln').modal('toggle');
	  });
	  $('#btn_buyBuilding_cancel').on('click',function(){
	  		destinations[destinations.length]={'location':{'lat':0, 'long':0, 'accu':0},'object':null};
			localStorage.setItem('destinations',JSON.stringify(destinations));	
			//$('#modalKaufen').modal('toggle');	
			hideAllModals(); 		
			$('#modalWuerfeln').modal('toggle');
	  });
	  
	  $('#btn_rentBuilding').on('click',function(){
	  		
			sendReqRentBuilding(user.userID, $('#hidden_rent_user_id').val(), currentGame.gameID, $('#hidden_building_id_buy').val());
		  	destinations[destinations.length]={'location':{'lat':0, 'long':0, 'accu':0},'object':null};
			localStorage.setItem('destinations',JSON.stringify(destinations));	
			//$('#modalKaufen').modal('toggle');
			hideAllModals();	 		
			$('#modalWuerfeln').modal('toggle');
	  });
	  
	   $('#btn_upgradeBuilding').on('click',function(){
	  		sendReqUpgradeBuilding(user.userID, currentGame.gameID, $('#hidden_upgrade_building_id').val());
		  	if(typeof JSON.parse(localStorage.getItem('currentGame')).gameID!='undefined')
			{
				currentGame=JSON.parse(localStorage.getItem('currentGame'));
				updateBuildingMarkers();
			}
			//sendReqUpgradeBuilding(user.userID, currentGame.gameID, building.buildingID);
			hideAllModals();
			$('#modalWuerfeln').modal('toggle');
	  });
	  $('#btn_upgradeBuilding_cancel').on('click',function(){
		  //sendReqUpgradeBuilding(user.userID, currentGame.gameID, building.buildingID);
		  hideAllModals();
		  $('#modalWuerfeln').modal('toggle');
	  });
	  $('#btn_card').on('click',function(){
		  sendReqUserGotCard($('#hidden_card_action_id').val(), currentGame.gameID, user.userID, playground.playgroundID);
		  hideAllModals();
	  });
	  
	  $('#btn_card_action').on('click',function(){
		  //starte counter, 
		  //
		  
		  time=$('#lbl_card_action_time').html();
		  
		  counterActionCard=window.setInterval(updateCounter,1000);	  
		  hideAllModals();
	  });
	  $('#btn_spielende2').on('click',function(){
	  		hideAllModals();
			$('#modalSpielende').modal('toggle');
	  });
	  $('#btn_spielende').on('click',function(){
	  		hideAllModals();
	  });
	  
	  
	  function updateCounter()
	  {
		  time-=1;
		  $('#lbl_time').html(Math.floor(time/60)+':'+time%60);
		  if(time<=0)
		  {
			  alert('time ran out');
			  destinations.pop();
			  localStorage.setItem('destinations',JSON.stringify(destinations));
			  window.clearInterval(counterActionCard);
			  
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
				  var lastDistance=parseInt(GetDistance(lastKnownPosition.lat,lastKnownPosition.long,event.coords.latitude,event.coords.longitude));
				  console.log(lastDistance);
				  user.distanceWalked=lastDistance+parseInt(user.distanceWalked);
				  walkedDistanceSinceMoney+=lastDistance;
				  checkwalkedDistanceEvent();
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
			if(typeof user.distanceWalked=='undefined')
			{
				user.distanceWalked=0;
			}
			if(!lastKnownPosition)
			{	//If the lastknownPosition is not set, a update all with no coordinates is dispatched.
				console.log("updateall: "+user.userID+" "+user.distanceWalked); 
				sendRequpdateAll(user.userID, 0,0, 0,user.distanceWalked, currentGame.gameID);
			}
			else
			{
				
				console.log("updateall: "+user.userID+" "+user.distanceWalked); 
				sendRequpdateAll(user.userID, lastKnownPosition.lat,lastKnownPosition.long, lastKnownPosition.accu, user.distanceWalked, currentGame.gameID);
			}
			
			
			//the user and game object are renewed after the UpdateAllRequest
			var oldDistance=user.distanceWalked;
			user = JSON.parse(localStorage.getItem('user'));
			user.distanceWalked=oldDistance;
	 		currentGame=JSON.parse(localStorage.getItem('currentGame'));
	  		
	  		//
			updateHUD();
			updateBuildingmarkers();
			updatePlayermarkers();
			buildScoreTable();
			//The userRole is only available after the first updateAll!
			
			if(currentGame.finished!=null)
			{
			  //Was kommt jetzt????
			  //console.log(destinations.length);
			  
				  if(destinations[destinations.length-1].object!='gameEnded')
				  {
					hideAllModals();
					currentGame.buildings[0].name;
					destinations=[{
						  'location':{
						  'lat':currentGame.buildings[0].location.lat, 'long':currentGame.buildings[0].location.long, 'accu':currentGame.buildings[0].location.accu
						  },
						  'object':'gameEnded'
					}];	 
					localStorage.setItem('destinations',JSON.stringify(destinations));
					//window.clearInterval(updateInterval);			//The updateAll loop is cleared
					 console.log("spiel beendet");
					$('#lbl_spielende_building').html(currentGame.buildings[0].name);
					$('#modalSpielende2').modal({show:true});
					//localStorage.removeItem('currentGame');		//
					//localStorage.removeItem('playground');		//
				  }
			  
			}
		},5000); 
	  var logLoop=window.setInterval(function(){
		  	sendReqUpdateLog(currentGame.gameID); 
			logs=JSON.parse(localStorage.getItem('logs'));
			
			for(logEntry in logs)
			{
				if(logs[logEntry].textid==11)
				{
					$('#lbl_ende_winner').html(logs[logEntry].user.username);
				}
				else
				{
					//irgendwas mit den logs tun
					//console.log(logs[logEntry]);
				}
			}
		  },2000);
	  function buildScoreTable()
	  {
		  /*
		  <tr>
 					<th>Name</th>
 					<th>km</th>
 					<th>ÖS</th>
 				</tr>
 				<tr>
 					<td>Hugo</td>
 					<td>20</td>
 					<td class="text_right">10.000</td>
 				</tr>
		  */
		  while(document.getElementById('table_spielstand').hasChildNodes())
		  {
			  document.getElementById('table_spielstand').removeChild(document.getElementById('table_spielstand').firstChild);
		  }
		  
		  var row=document.createElement('tr');
		  var headerName=document.createElement('th');
		  	headerName.innerHTML='Name';
		 var headerM=document.createElement('th');
		  	headerM.innerHTML='m';
		  var headerOes=document.createElement('th');
		  	headerOes.innerHTML='ÖS';
			row.appendChild(headerName);
			row.appendChild(headerM);
			row.appendChild(headerOes);
			document.getElementById('table_spielstand').appendChild(row);
			
			
		  for(vuser in currentGame.users)
		  {
			 var row=document.createElement('tr');
			 var tName=document.createElement('td');
		  		tName.innerHTML=currentGame.users[vuser].username;
		 	 var tM=document.createElement('td');
		  		tM.innerHTML=currentGame.users[vuser].distanceWalked;
		 	 var tOes=document.createElement('td');
		  		tOes.innerHTML=currentGame.users[vuser].money;
			
			row.appendChild(tName);
			row.appendChild(tM);
			row.appendChild(tOes);
			
			document.getElementById('table_spielstand').appendChild(row);
		  }
	  }
	  function hideAllModals()
	  {
		  var modals=['Logout','StopGame','Wuerfeln','Wuerfeln2','Kaufen','Mieten','Upgraden','Spielstand','Aktion','Card','Bankrott','Spielende','Spielende2'];
		  for(i=0; i<modals.length;i++)
		  {
			  $('#modal'+modals[i]).modal({show:false});
			  $('#modal'+modals[i]).hide();
		  }
	  }
	  //AUTOR: TOM
	  //check for cards or buildings in range
	  function checkPositionEvents(lat,lon)
	  {
		  //karte kann gezogen werden wenn ma nirgends hin muss oder wenn ma zu einem gebäude muss aber nicht, wenn eine karte eingetragen ist
		  var checkCard=false;
		  
		  //Wenn das objekt nicht leer is muss unterschieden werden
		  if(typeof destinations[destinations.length-1].object!='undefined')
		  {
			  
			  if(destinations[destinations.length-1].object!=null)
			  {
				  //ist darin keine cardID enthalten, darf eine karte gezogen werden. 
				  
				  if(typeof destinations[destinations.length-1].object.cardID=='undefined')
				  {
					   checkCard=true;
				  }
				  
				 
				  if(typeof destinations[destinations.length-1].object.destinationLocation!='undefined')
				  {
					 //ist dort drin eine karte drin muss auch was passieren:
					  	//console.log(destinations[destinations.length-1].object.destinationLocation);
						 //reachedDestination
						  if(GetDistance(lat,lon,destinations[destinations.length-1].object.destinationLocation.lat,destinations[destinations.length-1].object.destinationLocation.long)<destinations[destinations.length-1].object.destinationLocation.accu)
						  {
							  
							  raiseCardEvent(destinations[destinations.length-1].object,1);
						  }
					
				  }
				  if( typeof destinations[destinations.length-1].object.buildingID!='undefined')
				  {
					  
							checkCard=true;
						//console.log(GetDistance(lat,lon,destinations[destinations.length-1].location.lat,destinations[destinations.length-1].location.long));
						  if(GetDistance(lat,lon,destinations[destinations.length-1].location.lat,destinations[destinations.length-1].location.long)<destinations[destinations.length-1].location.accu)
						  {
							 // console.log(destinations[destinations.length-1].object);
							 raiseBuildingEvent(destinations[destinations.length-1].object);
						  }
					  
				  }
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
					  raiseCardEvent(currentGame.cards[card],0);
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
			  destinationMarker=L.circle([destinations[destinations.length-1].location.lat,destinations[destinations.length-1].location.long], destinations[destinations.length-1].location.accu*1.05, {
			  color: 'blue',
			  fillColor: '#03f',
			  fillOpacity: 0.2});
			  destinationMarker.addTo(map).bindPopup("Dein Ziel");
		  }
		  
		  /*
		  if(debug)
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
	  function checkwalkedDistanceEvent()
	  {
		  //console.log(walkedDistanceSinceMoney);
		  if(walkedDistanceSinceMoney>500)
		  {
			  walkedDistanceSinceMoney=0;
			  //console.log("requestedMoneyToGo");
			  sendReqMoneyToGo(user.userID, currentGame.gameID);
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
			 // console.log("distance: "+walkedDistanceS+", Time: "+walkedTime);
			  raiseSpeedingTicket();
		  }		  
	  }
	  
	  //AUTOR: TOM
	  //raises a speeding ticket
	  function raiseSpeedingTicket()
	  {
		  sendReqSpeedTicket(user.userID, currentGame.gameID);
		  var oldDistance=user.distanceWalked;
			user = JSON.parse(localStorage.getItem('user'));
			user.distanceWalked=oldDistance;
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
	  
	  //AUTOR: Tom
	  //type=0 => normales karte gezogen, type=1 => ziel bei aktionskarte erreicht. 
	  function raiseCardEvent(card,type)
	  {
		  console.log(card);
		  if (card.alreadyTriggered==1){
			  //Karte schon gezogen
			  
			  }
		  else {
			  if(type==0)
			  {
				  //Karte noch frei
				  if(card.type.typeID!=15)
				  {
					  console.log("user got normal card");
					  $('#lbl_card_titel').html(card.titel);
					  $('#lbl_card_text').html(card.text);
					  $('#lbl_card_amount').html(card.amount*playground.moneyToGo);
					  $('#hidden_card_id').html(card.cardID);
					  $('#img_card').attr('src','img/'+card.type.iconURL);
					  $('#modalCard').modal({show:true});
					  
					  
						
				  }
				  else
				  {
					  console.log("user got action card");
					  destinations[destinations.length]={'location':{'lat':card.destinationLocation.lat, 'long':card.destinationLocation.long, 'accu':card.destinationLocation.accu},'object':card};	 		
		   			  localStorage.setItem('destinations',JSON.stringify(destinations));
					  
					  $('#img_card_action').attr('src','img/'+card.type.iconURL);
					   $('#lbl_card_action_titel').html(card.titel);
					  $('#lbl_card_action_text').html(card.text);
					  $('#lbl_card_action_time').html(card.timeToGo);
					  $('#lbl_card_action_amount').html(card.amount*playground.moneyToGo);
					  $('#hidden_card_id').html(card.cardID);
					  $('#modalAktion').modal({show:true});
					  //speichere destination, 
					  
					  //gib des modal dazu aus, 
					  // 
				  }
			  }
			  if(type==1)
			  {
				  //lösche destination raus, sodass wieder die zuletzt gewürfelte drin is, 
				  //
				  //console.log("hallo");
				  sendReqUserGotCard(card.selectedCardID, currentGame.gameID, user.userID);
				  card.alreadyTriggered=1;
			  }
			  //alreadyTriggered auf true setzen
			  
			  
			  } 
			  
			  
		 user = JSON.parse(localStorage.getItem("user"));	  
	  }
	  
	  
	  
	  //AUTOR: 
	  //
	  function raiseBuildingEvent(building)
	  {
		  //console.log(building);
		  if(typeof building.owner=='undefined') {
		  	console.log('Buy, money: '+user.money+' value:'+building.buyValue);		  		
		  	if(Math.floor(user.money) >= Math.floor(building.buyValue)) {
				destinations[destinations.length]={'location':{'lat':0, 'long':0, 'accu':0},'object':null};
				localStorage.setItem('destinations',JSON.stringify(destinations));
				$('#lbl_buildingNameBuy').html(building.name);
				$('#img_gebauede_buy').attr('src','img/gebaeude/'+building.picture);
				$('#lbl_buyFee').html(building.fee);
				$('#lbl_buyPrice').html(building.buyValue);
				$('#hidden_building_id_buy').val(building.buildingID);
		  		$('#modalKaufen').modal({show:true});
		  	}
			else
			{
				//meldung ausgeben. 
				destinations[destinations.length]={'location':{'lat':0, 'long':0, 'accu':0},'object':null};
				localStorage.setItem('destinations',JSON.stringify(destinations));
				$('#modalWuerfeln').modal('trigger');
			}
		  	
		  }
		  if(typeof building.owner!='undefined')
		  {
			 
			  if(building.owner.userID==user.userID)
			  {
				   
				  if(Math.floor(user.money) >= Math.floor(building.buyValue*0.25)) {
					  //upgrade
					  $('#lbl_UpgradeBuildingName').html(building.name);
					  $('#img_gebauede_upgrade').attr('src','img/gebaeude/'+building.picture);
					  $('#lbl_upgradeCost').html(building.buyValue*0.25);
					  $('#lbl_upgradeFeeBefore').html(building.fee);
					  
					  $('#hidden_upgrade_building_id').val(building.buildingID);
					  destinations[destinations.length]={'location':{'lat':0, 'long':0, 'accu':0},'object':null};
					  localStorage.setItem('destinations',JSON.stringify(destinations));
					  $('#modalUpgraden').modal({show:true});
				  }
			  }
			  else
			  {
				  if(Math.floor(user.money) >= Math.floor(building.fee)) {
					  console.log('rent');
					   $('#lbl_RentBuildingName').html(building.name);
					  $('#img_gebauede_rent').attr('src','img/gebaeude/'+building.picture);
					  $('#lbl_rentFee').html(building.fee);
					  
					  $('#hidden_rent_building_id').val(building.buildingID);
					  $('#hidden_rent_user_id').val(building.owner.userID);
					  $('#modalMieten').modal({show:true});
					  
				  }
				  else
				  {
					  console.log(user.money+">="+building.fee+'='+(user.money >= building.fee));
					  bankrupt();
				  }
			  }
		  }
	  }
	  
	  function bankrupt()
	  {
		  sendReqBankrupt(user.userID,currentGame.gameID);
		  
		  if(debug)
		  {
			  window.clearInterval(debugInterval);
		  }
		  
		  currentGame.buildings[0].name;
		  destinations=[{
	  				'location':{
					'lat':currentGame.buildings[0].location.lat, 'long':currentGame.buildings[0].location.long, 'accu':currentGame.buildings[0].location.accu
					},
					'object':'bankrupt'
	  		}];	 
		  localStorage.setItem('destinations',JSON.stringify(destinations));
		  //window.clearInterval(updateInterval);			//The updateAll loop is cleared
		  //navigator.geolocation.clearWatch(watchId);	//the geolocation watchposition is cleared. 
		  console.log("bankrott");
		  $('#lbl_bankrott_building').html(currentGame.buildings[0].name);
		  $('#modalBankrott').modal({show:true});
	  }
	  
	  //Debugging functions
	  if(debug)
	  {
		//a destination object is made
		//destinations[0].location=currentGame.buildings[0].location;
		//destinations[0].object=currentGame.buildings[0];
		 
		//this interval is for -getting the global debug values into this anonymous function 
		var debugInterval=window.setInterval(function()
	  	{
			if(debuginit)
			{
			  if(lastKnownPosition!=null)
				{
					var lastDistance=parseInt(GetDistance(lastKnownPosition.lat,lastKnownPosition.long,debuglat,debuglon));
					console.log(lastDistance+" "+lastKnownPosition.lat+" "+lastKnownPosition.long+" "+debuglat+" "+debuglon+" "+user.distanceWalked);
					user.distanceWalked=lastDistance+parseInt(user.distanceWalked);
					walkedDistanceSinceMoney+=lastDistance;
					checkwalkedDistanceEvent();
				}
				
				
				
			  //checkForSpeedingTicket(debuglat,debuglon,0,debugtime);				//debug 		  
			  lastKnownPosition={'lat':debuglat, 'long':debuglon, 'accu':0};		//
			  lastPositionUpdate=debugtime;										//
			  checkPositionEvents(lastKnownPosition.lat,lastKnownPosition.long);	//
			}
			
		},5000);  
	  }
	  
	  
});

var debuglat=0;
var debuglon=0;
var debugtime=new Date();
var debuginit=false;
//AUTOR: TOM
//debug function, which is accessible from the browser-console
function simulatePosition(lat, lon)
{
	debuginit=true;
	debugtime=new Date();
	debuglat=lat;
	debuglon=lon;
}
