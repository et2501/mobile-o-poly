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
		{	//set a temporary localStorage var for the createGame.html to know that its in the createGame mode
			localStorage.setItem('crGa','create');
			window.location.href = "createGame.html";
		});
	
	$('#btn_join_game').on('click',function()
		{	//set a temporary localStorage var for the createGame.html to know that its in the createGame mode
			localStorage.setItem('crGa','join');
			window.location.href = "createGame.html";
		});
});