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

//loadGameStatistics
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

function sendReqMoneyToGo(userID, gameID, playgroundID)
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
			},
			"playground":{
				"playgroundID":playgroundID	
			}
		}
	}
	send(send_obj);
}

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
														window.location.href = "menu.html";
													}
													else
														alert(data['loggedInUser']['error']);
				  										break;
						case 'playground': 				localStorage.setItem('playgrounds',JSON.stringify(data['playgrounds']));
														listPlaygrounds(data['playgrounds']);
														break;
						case 'checkStartedGame':
						case 'createdGame':	
						case 'attendGame':				if(!data['currentGame']['error'])
														{	localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
															buildPlayerTable(data['currentGame']['playground']['maxPlayers'],data['currentGame']['users']);
															$('#sec_waitForGamers').show();
															$('#sec_attendGame').hide();
															$('#sec_createGame_2').hide();
															
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
														console.log(data);
														localStorage.clear();
														setTimeout(window.location.href = "index.html",500); //an return to login-screen
														break;
						case 'loadGlobalStatistics':	
														//TODO Irgendwas mit den Statistiken anfangen
														console.log(data);
														break;
						case 'loadGameStatistics':		//TODO Irgendwas mit den Statistiken anfangen
														console.log(data);
														break;
						case 'UpdateLog':				//TODO Irgendwas mit dem Log anfangen
														console.log(data);
														break;
						case 'updateAll':				//TODO
														//console.log("updateAll eingetroffen");
														//console.log(data);
														
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
														
														break;
						case 'SpeedTicket':				
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														break;
						case 'MoneyToGo':				
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));
														break;	
						case 'changeNick': 				//check for error
														localStorage.setItem('user', JSON.stringify(data['loggedInUser']));								
														break;
						case 'StopGame': 				
														console.log(data);
														localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
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