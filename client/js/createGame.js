var gamename;
var time_to_play;
var selected_playground;
var selected_mode;

//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	$('#sec_createGame_2').hide();
	$('#cont_startButton').hide();
	$('#tr_timetoplay').hide();
	
	if(localStorage.getItem('crGa')=='create')
	{	$('#sec_attendGame').hide();
		$('#sec_waitForGamers').hide();
		sendReqPlaygrounds(); //get all the playgrounds
	}
	if(localStorage.getItem('crGa')=='join')
	{	$('#sec_createGame_1').hide();
		$('#sec_waitForGamers').hide();
	}
	if(localStorage.getItem('crGa')=='waiting')
	{	$('#sec_createGame_1').hide();
		$('#sec_attendGame').hide();
		if(localStorage.getItem('asWhat')=='admin')
			$('#cont_startButton').show();
		localStorage.removeItem('asWhat');
		localStorage.setItem('interval',window.setInterval(checkIfStarted, 5000));
	}
	localStorage.removeItem('crGa');
		
	$("[name=mode]").removeAttr("checked");
	
	var user = JSON.parse(localStorage.getItem('user'));
	
	//show time textfield if time mode is chosen
	$("input:radio").change(function()
		{	if($("input:radio[name='mode']:checked").val() == 'Zeit')
				$('#tr_timetoplay').show();
			else
				$('#tr_timetoplay').hide();
		});
	
	$('#lbl_menu_nickname').html(user.username);
	
	$('#btn_logout').on('click',function()
		{	localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //and return to login-screen
		});
	
	$('#btn_next_1').on('click',function()
		{	//save the selected index and the name in global variables
			gamename = $('#txt_crga_groupname').attr('value');
			selected_playground = (isNaN(parseInt($("input:radio[name='playgrounds']:checked").val()))?null:parseInt($("input:radio[name='playgrounds']:checked").val()));
			
			if(gamename&&selected_playground!=null)
			{	$('#sec_createGame_1').hide();
				$('#sec_createGame_2').show();
				$('#lbl_playground_name').html(JSON.parse(localStorage.getItem('playgrounds'))[selected_playground].name);
			}
			else
				alert("Bitte ein Spielfeld auswählen und einen Namen eingeben!");
		});
	
	$('#btn_next_2').on('click',function()
		{	selected_mode = $("input:radio[name='mode']:checked").val();
			if(selected_mode == 'Zeit')
				time_to_play = $('#txt_timetoplay').attr('value');
			else
				time_to_play = 0;
			
			$("#form_timetoplay").validate({
				rules: {
					txt_timetoplay: {
						digits: true				
					}
				}
			});
			
			if($('#form_timetoplay').valid())
				if(selected_mode&&(selected_mode=='Zeit'?time_to_play:true))
				{	$('#txt_timetoplay').val('');
					$('#txt_crga_groupname').val('');
					$('#cont_startButton').show();
					sendReqnewGame(gamename,JSON.parse(localStorage.getItem('playgrounds'))[selected_playground].playgroundID,user.userID,selected_mode,time_to_play);
				}
				else
					alert('Bitte einen Modus auswählen und wenn nötig Zeit eingeben!');
		});
	
	$('#btn_back').on('click',function()
		{	$('#sec_createGame_1').show();
			$('#sec_createGame_2').hide();
		});
	
	$('#btn_back_2').on('click',function()
		{	window.location.href="menu.html";
		});
		
	$('#btn_back_3').on('click',function()
		{	window.location.href="menu.html";
		});	
	
	$('#btn_next_3').on('click',function()
		{	gname = $('#txt_attendGame').attr('value');
		
			if(gname)
			{	$('#txt_attendGame').val('');
				sendReqattendGame(user['userID'],gname);
			}
			else
				alert('Bitte geben Sie einen Spielenamen ein!');
		});
	
	$('#btn_forceStart').on('click',function()
		{	//look if there are at least 2 players!!!
			if(JSON.parse(localStorage.getItem('currentGame'))['users'].length>1)
				sendReqStartGame(JSON.parse(localStorage.getItem('currentGame'))['gameID'],JSON.parse(localStorage.getItem('currentGame'))['gameName']);
			else
				alert('Zumindest 2 Spieler!!');
		});
});

//AUTOR: BIBI
//generated the playground-list table
function listPlaygrounds(pgs)
{	$('#table_playgrounds').html('');

	output = "<table>";
	counter = 0;
		
	$.each(pgs, function(index, value)
		{	counter++;
			if(counter%2 == 1)
				output += "<tr>";
			
			//ATTENTION in the checkbox value ----> is the index of the playground in the playground array stored in localStorage!!!!
			//NOT the id of the playground
			output += "<td><input type='radio' name='playgrounds' value='"+(counter-1)+"' />"+value['name']+"</td>";
			
			if(counter%2 == 0)
				output += "</tr>";
		});
		
	if(counter%2 == 1)
		output += "<td></td></tr>";
				
	output += "</table>";
	$('#table_playgrounds').append(output);
	//IMPORTANT: without hiding and showing the main container --> on some mobile phones the DOM change would not appear!!
	$('#sec_createGame_1').hide();
	$('#sec_createGame_1').show(); 
}

//AUTOR: BIBI
//generates the waiting for user table
function buildPlayerTable(maxPlayers,users)
{	$('#table_waitForPlayers').html('');
	$('#lbl_menu_gamename').html("Spielname: "+JSON.parse(localStorage.getItem('currentGame'))['gameName']);
	output = "<table>";

	for(i=0;i<maxPlayers;i++)
	{	if(users[i])
			output+='<tr><td>'+users[i]['username']+'</td><td style="background-color:red"></td></tr>';
		else
			output+='<tr><td>Freier Slot</td><td style="background-color:green"></td></tr>';
	}

	output+="</table>";
	$('#table_waitForPlayers').append(output);
	$('#sec_waitForGamers').hide();
	$('#sec_waitForGamers').show();
}


//AUTOR: BIBI
//checks every 5 seconds if the game is already started
function checkIfStarted()
{	sendReqCheckStarted(JSON.parse(localStorage.getItem('currentGame'))['gameID'],JSON.parse(localStorage.getItem('currentGame'))['gameName']);
}

//AUTOR: BIBI
//checks if the game has already started!!
function checkStarted()
{	if(parseInt(JSON.parse(localStorage.getItem('currentGame'))['isStarted'])==1)
	{	//STOP THE TIMER
		window.clearInterval(parseInt(localStorage.getItem('interval')));
		localStorage.removeItem('interval');
		window.location.href = "game.html";
	}
}