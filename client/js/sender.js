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
						case 'createdGame':				alert("test");
														localStorage.setItem('currentGame',JSON.stringify(data['currentGame']));
														break;
				  }
		},
		error : function(xhr, type) { 
				alert("schas!");
		}  
	});
}