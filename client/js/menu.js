//AUTOR: BIBI
$(document).ready(function(e) {
	//first of all look if there is a loggedInUser!!!
	if(!localStorage.getItem('user'))
		window.location.href = "index.html";
	
	var user = JSON.parse(localStorage.getItem('user'));
	
	$('#lbl_menu_nickname').html(user.username);
	
	$('#btn_logout').on('click',function()
		{	localStorage.clear(); //if logout --> delete everything in localStorage
			window.location.href = "index.html"; //an return to login-screen
		});
	
	$('#btn_create_game').on('click',function()
		{	window.location.href = "createGame.html";
		});
});