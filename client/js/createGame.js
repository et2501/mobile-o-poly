var gamename;
var time_to_play;
var selected_playground;
var selected_mode;

//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
		
	
	var user = JSON.parse(localStorage.getItem('user'));
		
	$('#usr_name').html(user.username);
		
	sendReqPlaygrounds();
	
		
	$('#lbl_menu_nickname').html(user.username);
	
	$('#btn_logout').on('click',function()
		{	localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //and return to login-screen
		});
	$('#btn_cancel').on('click',function()
	{
		window.location.href = "index.html";
	});
	$('#btn_next_2').on('click',function()
		{	
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
			
			if($('#form_log').valid())
				if(selected_mode&&(selected_mode=='Zeit'?time_to_play:true))
				{	$('#txt_timetoplay').val('');
					
					sendReqnewGame(localStorage.getItem('gamename'),JSON.parse(localStorage.getItem('playground')).playgroundID,user.userID,selected_mode,time_to_play);
				}
				else
					alert('Bitte einen Modus auswählen und wenn nötig Zeit eingeben!');
		});
	
	
	$('#btn_beitreten').on('click',function()
		{	gname = $('#txt_attendGame').attr('value');
		
			if(gname)
			{	
				$('#txt_attendGame').val('');
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

//AUTOR: BIBI, ch TOM
//generated the playground-list table
function listPlaygrounds(pgs)
{	
	$('.spielfeld').html('');

	output="";
	counter = 0;
		
	console.log(pgs);
	$.each(pgs, function(index, value)
		{	
			counter++;
			output += "<div class='city left house"+counter+"' value='"+index+"' onclick='changeSelection("+(index+1*1)+","+pgs.length+")'><div class='player_number'><span class='number'>"+value.maxPlayers+"</span></div>";
			console.log(value); 
			
			if(counter%2 == 1)
				output+="<img src='img/house.png' alt='House'";
			else
				output+="<img src='img/town.png' alt='House'";
			
			output+=" class='icon_spielfeld img_house"+counter+"'/><p>"+value['name']+"</p></div>";
			
			//ATTENTION in the checkbox value ----> is the index of the playground in the playground array stored in localStorage!!!!
			//NOT the id of the playground
		});
		
	$('.spielfeld').append(output); 
}



function changeSelection(index, nPgs)
{
	
	if(index%2==1)
	{
		
				if($(".house"+index).hasClass('active'))
				{
  					$(".img_house"+index).attr('src','img/house.png');
  					$(".house"+index).removeClass('active');
					selected_playground=null;
  				}
				else
				{
					deactivateAll(nPgs);
					selected_playground=index-1;
  					$(".img_house"+index).attr('src','img/house_inverse.png');
  					$(".house"+index).addClass('active');	
 				}
	}
	else
	{	
				if($(".house"+index).hasClass('active'))
				{
  					$(".img_house"+index).attr('src','img/town.png');
  					$(".house"+index).removeClass('active');
				  selected_playground=null;
  				}
				else
				{
					deactivateAll(nPgs);
					selected_playground=index-1;
  					$(".img_house"+index).attr('src','img/town_inverse.png');
  					$(".house"+index).addClass('active');	
 				}
	}
}
function deactivateAll(numberPgs)
{
	for(i=1;i<numberPgs+1;i++)
	{
		if($(".house"+i).hasClass('active'))
			$(".house"+i).removeClass('active');
		if(i%2==1)
		{
			$(".img_house"+i).attr('src','img/house.png');
		}
		else
			$(".img_house"+i).attr('src','img/town.png');
	
	}
	
}
function checkAndForward()
{
	if(selected_playground!=null&&$('#txt_crga_groupname').val()!="")
	{
		localStorage.setItem('playground',JSON.stringify(JSON.parse(localStorage.getItem('playgrounds'))[selected_playground]));
		localStorage.setItem('gamename',$('#txt_crga_groupname').val());
		window.location.href = "modus.html";
	}
	else
	{
		alert($('#txt_crga_groupname').val());
	}
}

//AUTOR: BIBI
//checks every 5 seconds if the game is already started
function checkIfStarted()
{	
	sendReqCheckStarted(JSON.parse(localStorage.getItem('currentGame'))['gameID'],JSON.parse(localStorage.getItem('currentGame'))['gameName']);
}

//AUTOR: BIBI
//checks if the game has already started!!
function checkStarted()
{	
	
	if(parseInt(JSON.parse(localStorage.getItem('currentGame'))['isStarted'])==1)
	{	//STOP THE TIMER
		window.clearInterval(parseInt(localStorage.getItem('interval')));
		localStorage.removeItem('interval');
		window.location.href = "game.html";
	}
}

function buildPlayerTableOnce()
{
	var maxPlayers=JSON.parse(localStorage.getItem('currentGame')).playground.maxPlayers;
	var table=document.getElementById('playerTable');
	for(i=0;i<maxPlayers;i++)
	{
		overdiv=document.createElement('div');
		overdiv.setAttribute('id','userElement'+i);
		overdiv.setAttribute('class','user2');
			underdiv1 =document.createElement('div');
			$(underdiv1).attr('id','userName'+i);
			underdiv2 =document.createElement('div');
			$(underdiv1).addClass('spieler left');
			$(underdiv2).addClass('italic right');
			$(underdiv2).html('Spieler'+(i+1));
		overdiv.appendChild(underdiv1);
		overdiv.appendChild(underdiv2);	
			//underdiv1.setAttribute('class','spieler left');
		table.appendChild(overdiv);	
	}
	localStorage.setItem('interval',window.setInterval(checkIfStarted, 5000));
}
//AUTOR: BIBI
//generates the waiting for user table
function buildPlayerTable(maxPlayers,users)
{
	for(i=0;i<maxPlayers;i++)
	{			
		if(users[i])
			{
				$('#userElement'+i).addClass('teilnahme');
				$('#userName'+i).html(users[i]['username']);
			}
		
	}
	$('#lbl_player_count').html('"'+users.length+'" von "'+maxPlayers+'" Spielern nehmen am Spiel "'+JSON.parse(localStorage.getItem('currentGame'))['gameName']+'" teil.');
}

function selectMode(mode)
{
	
	//remove invers from everthing
	if($('#modeZeit').hasClass("invers"))
		$('#modeZeit').removeClass("invers");
	
	if($('#modeWirtschaft').hasClass("invers"))
		$('#modeWirtschaft').removeClass("invers");
	
	if($('#modeMonopol').hasClass("invers"))
		$('#modeMonopol').removeClass("invers");
	
	if(!$('#mode'+mode).hasClass("invers"))
	{
		$('#mode'+mode).addClass("invers");
		selected_mode=mode;
	}
}