//AUTOR: BIBI
//REQUEST OBJECT FOR LOGIN
function sendReqLogin(mail,password)
{	send_obj = 
	{	"type":"login",
    	"object": 
		{	"email": mail,
        	"password": password
    	}
	};
	
	send(send_obj);
}

//AUTOR: BIBI
//REQUEST OBJECT FOR REGISTER
function sendReqRegister(mail,nickname,password)
{	send_obj =
	{	"type":"register",
    	"object": 
		{	"email": mail,
        	"username": nickname,
        	"password": password
    	}
	};
	
	send(send_obj);
}

//AUTOR: BIBI
//REQUEST OBJECT FOR GETTING ALL PLAYGROUNDS
function sendReqPlaygrounds()
{	send_obj = 
	{	"type":"loadAllPlaygrounds"
	}
	
	send(send_obj);
}

//AUTOR:BIBI
//REQUEST NEW GAME
function sendReqnewGame(gamename,playgroundID,userID,mode,timetoplay)
{	send_obj =
	{	"type":"createGame",
    	"object": {
        "playgroundID": playgroundID,
        "gameName": gamename,
		"userID": userID,
		"mode": mode,
		"timetoplay": timetoplay
    	}
	};
	
	send(send_obj);
}

//AUTOR: BIBI
//REQUEST ATTEND GAME
function sendReqattendGame(userID,gameName)
{	send_obj = 
	{	"type": "attendGame",
    	"object": 
		{	"game": {
        		"gameName": gameName
    		},
			"user":{
				"userID": userID
			}
		}
	};
	
	send(send_obj);
}

//AUTOR: BIBI
//REQUEST CHECK IF THE GAME HAS ALREADY STARTED
function sendReqCheckStarted(gameID,gameName)
{	send_obj = 
	{	"type": "checkStartedGame",
    	"object": {
        	"game": {
				"gameID": gameID,
				"gameName": gameName
			}
    	}
	};
	
	send(send_obj);
}

//AUTOR: BIBI
//REQUEST START GAME 
function sendReqStartGame(gameID,gameName)
{	send_obj =
	{	"type": "startGame",
		"object":	{
			"game": {
				"gameID": gameID,
				"gameName": gameName
			}
		}
	};
	
	send(send_obj);
}


//AUTOR: BIBI
//REQUEST LOOK IF A USER IS CURRENTLY IN A GAME
function sendReqIsUserInGame(userID)
{	send_obj =
	{	"type": "isUserInGame",
		"object":	{
			"user":{
				"userID": userID
			}
		}
	};
	
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR LOGOUT
function sendReqLogout(userID, gameID)
{
	send_obj=
	{
		"type":"logout",
		"object":{
			"user":{
				"userID": userID
			},
			"game":{
				"gameID":gameID
			}
		}
	};
	
	send(send_obj);
	
}

//AUTOR: TOM
//REQUEST FOR LOGOUT
function sendReqBankrupt(userID, gameID)
{
	send_obj=
	{
		"type":"bankrupt",
		"object":{
			"user":{
				"userID": userID
			},
			"game":{
				"gameID":gameID
			}
		}
	};
	
	send(send_obj);
	
}

//AUTOR: TOM
//REQUEST FOR Global Statistics
function sendReqGlobalStatistics(userID)
{
	send_obj=
	{
		"type":"loadGlobalStatistics",
		"object":{
			"user":{
				"userID": userID
			}
		}
	};
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR Game Statistics
function sendReqGameStatistics(gameID)
{
	send_obj=
	{
		"type":"loadGameStatistics",
		"object":{
			"game":{
				"gameID": gameID
			}
		}
	};
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR Updating the Log
function sendReqUpdateLog(gameID)
{
	send_obj=
	{
		"type":"updateLog",
		"object":{
			"game":{
				"gameID": gameID
			}
		}
	};
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR for Update All
function sendRequpdateAll(userID, lat, lon, accu, distanceWalked,gameID)
{
	send_obj=
	{
		"type":"updateAll",
		"object":{
			"user":{
				"userID": userID,
				"distanceWalked":distanceWalked,
				"lastknownPosition":{
					"lat":lat,
					"long":lon,
					"accu":accu
				}
			},
			"game":{
				"gameID":gameID
			}
		}
	};
	//console.log(send_obj);
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR Speeding Ticket
function sendReqSpeedTicket(userID, gameID)
{
	send_obj=
	{
		"type":"SpeedTicket",
		"object":{
			"user":{
				"userID": userID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR MoneyToGo 
function sendReqMoneyToGo(userID, gameID)
{
	send_obj=
	{
		"type":"MoneyToGo",
		"object":{
			"user":{
				"userID": userID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR StopGame
function sendReqStopGame(userID, gameID)
{
	send_obj=
	{
		"type":"StopGame",
		"object":{
			"user":{
				"userID": userID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}

//AUTOR: TOM
//REQUEST FOR ChangeNick
function sendReqChangeNick(userID, password, newnick)
{
	send_obj=
	{
		"type":"changeNick",
		"object":{
			"user":{
				"userID": userID, 
				"password":password,
				"username": newnick
			}
		}
	}
	send(send_obj);
}

//AUTOR: MiKe
//REQUEST FOR UserGotCard
function sendReqUserGotCard(selectedCardID, gameID, userID)
{
	send_obj=
	{
		"type":"userGotCard",
		"object":{
			"card":{
				"selectedCardID": selectedCardID
			},
			"game":{
				"gameID": gameID
			},
			"user":{
				"userID": userID
				}
		}
		
	}
	console.log(send_obj);
	send(send_obj);
	
}

//AUTOR: MARCUS
//REQUEST FOR buyBuilding
function sendReqBuyBuilding(userID, gameID, buildingID)
{
	send_obj=
	{
		"type":"BuyBuilding",
		"object":{
			"user":{
				"userID": userID
			},
			"building":{
				"buildingID": buildingID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}
//UpgradeBuilding
function sendReqUpgradeBuilding(userID, gameID, buildingID)
{
	send_obj=
	{
		"type":"UpgradeBuilding",
		"object":{
			"user":{
				"userID": userID
			},
			"building":{
				"buildingID": buildingID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}
function sendReqRentBuilding(userID, ownerID, gameID, buildingID)
{
	send_obj=
	{
		"type":"RentBuilding",
		"object":{
			"user":{
				"userID": userID
			},
			"building":{
				"buildingID": buildingID, 
				"ownerID":ownerID
			},
			"game":{
				"gameID":gameID
			}
		}
	}
	send(send_obj);
}

//AUTOR: BIBI
//SEND FUNCTION
//SENDS THE JSON OBJ TO THE COMMUNICATOR ON THE SERVER AND HANDLES THE RESPONSE DATA
function send(obj) {
	$.ajax({       
		type : 'POST',  
		url : "http://flock-0308.students.fhstp.ac.at/server/communicator.php",
		data : { json: obj },  
		dataType:'json',
		success : function(data) {       
				  switch(data['type'])
				  {		case 'user': 				if(!data['loggedInUser']['error'])
				  									{	usr_obj = {
															"password": data['loggedInUser']['password'],
       														"username": data['loggedInUser']['username'],
       														"userID": data['loggedInUser']['userID']
														};
														
														localStorage.setItem('user',JSON.stringify(usr_obj));
														localStorage.setItem('trophytypes',JSON.stringify(data['loggedInUser']['trophies']));
														window.location.href = "start.html";
													}
													else
														alert(data['loggedInUser']['error']);
				  										break;
						case 'playground': 				localStorage.setItem('playgrounds',JSON.stringify(data['playgrounds']));
														listPlaygrounds(data['playgrounds']);
														break;
						case 'createdGame':
														if(!data['currentGame']['error'])
														{	
															localStorage.setItem('crGa','waiting');
															localStorage.setItem('asWhat','admin');
															localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
															
															setTimeout(window.location.href = "useruebersicht.html",500);
														}
														else
															alert(data['currentGame']['error']);
														break;
													
						case 'attendGame':				if(!data['currentGame']['error'])
														{	
															localStorage.setItem('crGa','waiting');
															localStorage.setItem('asWhat','player');
															localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
															
															setTimeout(window.location.href = "useruebersicht.html",500);
														}
														else
															alert(data['currentGame']['error']);
														break;
																				
						case 'checkStartedGame':		if(!data['currentGame']['error'])
														{	localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
															buildPlayerTable(data['currentGame']['playground']['maxPlayers'],data['currentGame']['users']);
															
															if(data['type'] != 'checkStartedGame')
																localStorage.setItem('interval',window.setInterval(checkIfStarted, 5000));
															else
																checkStarted();
															
				  										}
														else
															alert(data['currentGame']['error']);
														break;
														
						case 'userGame':				if(!data['currentGame']['error'])
														{	localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
				  											forwardTo();
														}
														break;
														
						case 'logout':					
														if(!data['success']['error'])
														{
														console.log(data);
														localStorage.clear();
														setTimeout(window.location.href = "index.html",500); //an return to login-screen
														}
														else
															alert(data['success']['error']);
														break;
														
													
						case 'loadGlobalStatistics':	
														if(!data['loggedInUser']['error'])
														{
														  //TODO Irgendwas mit den Statistiken anfangen
														  console.log(data);
				  										}
														else
															alert(data['loggedInUser']['error']);
														break;
														
						case 'loadGameStatistics':		if(!data['currentGame']['error'])
														{
														  //TODO Irgendwas mit den Statistiken anfangen
														  console.log(data);
														}
														else
															alert(data['currentGame']['error']);
														break;
						case 'updateLog':				
														  //TODO Irgendwas mit dem Log anfangen
														  localStorage.setItem('logs',JSON.stringify(data['log']));
														  //console.log(data);
														break;
						case 'updateAll':				//TODO
														//console.log("updateAll eingetroffen");
														//console.log(data);
														if(!data['loggedInUser']['error'])
														{
															if(!data['currentGame']['error'])
															{
																//TODO Irgendwas mit den Statistiken anfangen
																console.log(data);
														  		localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
																localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
															}
															else
															alert(data['currentGame']['error']);
				  										}
														else
															alert(data['loggedInUser']['error']);
																												
														break;
						case 'SpeedTicket':				
														if(!data['loggedInUser']['error'])
														{
														  localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														}
														else
															alert(data['loggedInUser']['error']);
														break;
						case 'MoneyToGo':				if(!data['loggedInUser']['error'])
														{
															localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														}
														else
															alert(data['loggedInUser']['error']);
														break;	
						case 'changeNick': 				//check for error
														if(!data['loggedInUser']['error'])
														{
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														}
														else
															alert(data['loggedInUser']['error']);
														break;
						case 'StopGame': 				
														if(!data['loggedInUser']['error'])
														{
														console.log(data);
														localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
														}
														else
															alert(data['loggedInUser']['error']);
														break;												
																																			
						case 'userGotCard':				
														
														if(!data['loggedInUser']['error'])
														{
															//console.log("is gegangen");
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														}
														else
															console.log(data['loggedInUser']);
														break;
						case 'BuyBuilding':
						case 'UpgradeBuilding':
						case 'RentBuilding': 			if(data['currentGame'])
														{
															localStorage.setItem('currentGame', JSON.stringify(data['currentGame']));
														}
														else
															//alert(data['loggedInUser']);
																												
														break;	
						case 'bankrupt':				if(!data['loggedInUser']['error'])
														{
															//console.log("is gegangen");
															localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
															localStorage.setItem('game', JSON.stringify(data['currentGame']));
														}
														else
															console.log(data['loggedInUser']);
														break;															
																						
						default: 						
						
														console.log("sonstiges");
														console.log(data);
														break;
				  }
		},
		error : function(xhr, type) { 
				alert("schas!");
		}  
	});
}