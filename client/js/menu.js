//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	var user = JSON.parse(localStorage.getItem('user'));
		
	//is there is a current game running go to game.html if its not running to createGame.html
	//ONLY WORKS IF THE USER HAS NOT LOGGED OUT IN BETWEEN!!
	//NO PROBLEM FOR GAME BECAUSE LOGOUT WILL MEAN THAT HE IS KICKED FROM GAME BUT PROBLEM IF HE IST WAITING FOR A GAME TO START!!!!
	
	//send a request if a user is currently in a game!!
	sendReqIsUserInGame(user['userID']);
	
	$('#usr_name').html(user.username);
	
	
	$('#btn_logout').on('click',function()
		{	localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //an return to login-screen
		});
	/*
	$('#btn_create_game').on('click',function()
		{	//set a temporary localStorage var for the createGame.html to know that its in the createGame mode
			localStorage.setItem('crGa','create');
			window.location.href = "createGame.html";
		});
	
	$('#btn_join_game').on('click',function()
		{	//set a temporary localStorage var for the createGame.html to know that its in the createGame mode
			localStorage.setItem('crGa','join');
			window.location.href = "createGame.html";
		});
		*/
});

function forwardTo()
{	game = JSON.parse(localStorage.getItem('currentGame'));
	if(game)
	{	if(parseInt(game['isStarted'])==1)
			window.location.href = "game.html";
		else
		{	
			//search for the user role!!
			run = true
			for(i=0;i<JSON.parse(localStorage.getItem('currentGame'))['users'].length&&run;i++)
				if(JSON.parse(localStorage.getItem('user'))['username']==JSON.parse(localStorage.getItem('currentGame'))['users'][i]['username'])
				{	run = false;
					role = JSON.parse(localStorage.getItem('currentGame'))['users'][i]['userRole'];
				}
			
			localStorage.setItem('asWhat',role);
			window.location.href = "useruebersicht.html";
		}
	}
}