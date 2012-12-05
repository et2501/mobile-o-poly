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
//SEND FUNCTION
//SENDS THE JSON OBJ TO THE COMMUNICATOR ON THE SERVER AND HANDLES THE RESPONSE DATA
function send(obj) {
	$.ajax({       
		type : 'POST',  
		url : "http://flock-0308.students.fhstp.ac.at/server/communicator.php",
		data : { json: obj },  
		dataType:'json',
		success : function(data) {       
				  switch(data['type'])
				  {		case 'User': 		if(!data['loggedInUser']['error'])
				  							{	usr_obj = {
													"password": data['loggedInUser']['password'],
       												"username": data['loggedInUser']['username'],
       												"userID": data['loggedInUser']['userID']
												};
												
												localStorage.setItem('user',JSON.stringify(usr_obj));
												localStorage.setItem('trophies',JSON.stringify(data['loggedInUser']['trophies']));
												window.location.href = "menu.html";
											}
											else
												alert(data['loggedInUser']['error']);
				  							break;
				  }
		},
		error : function(xhr, type) { 
				alert("schas!");
		}  
	});
}