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
	$('#tr_timetoplay').hide();
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
					sendReqnewGame(gamename,JSON.parse(localStorage.getItem('playgrounds'))[selected_playground].playgroundID,user.userID,selected_mode,time_to_play);
				}
				else
					alert('Bitte einen Modus auswählen und wenn nötig Zeit eingeben!');
		});
	
	$('#btn_back').on('click',function()
		{	$('#sec_createGame_1').show();
			$('#sec_createGame_2').hide();
		});
	
	sendReqPlaygrounds(); //get all the playgrounds
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