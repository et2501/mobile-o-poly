//AUTOR: BIBI
$(document).ready(function(e) {
	
	//HIDE REGISTER SECTION
	$('#sec_register').hide(); 
	
	//SWITCH TO REGISTER SECTION
	$('#btn_log_reg').on('click',function()
		{	$('#sec_register').show();
			$('#sec_login').hide();
		});
	
	//SWITCH FROM REGISTER BACK TO LOGIN
	//CLEAR THE TEXTFIELDS
	$('#btn_reg_cancel').on('click',function()
		{	$('#sec_register').hide();
			$('#sec_login').show();
			mail = $('#txt_reg_mail').val('');
			pass = $('#txt_reg_pass').val('');
			firstname = $('#txt_reg_nickname').val('');
		});
	
	//REGISTER
	//VALIDATES THE INPUT OF THE USER AND IF VALID CALLS THE BUILD REQUEST FUNCTION
	$("#btn_reg_reg").on('click',function()
		{	$("#form_reg").validate({
				rules: {
					txt_reg_mail: {
						required: true,
						email: true				
					},
					txt_reg_pass: {
						required: true,
						minlength: 5
					},
					txt_reg_pass_rep: {
						required: true,
						minlength: 5,
						equalTo: "#txt_reg_pass"
					},
					txt_reg_nickname: {
						required: true,
						minlength: 2
					}
				}
			});
			
			mail = $('#txt_reg_mail').attr('value');
			pass = $('#txt_reg_pass').attr('value');
			nickname = $('#txt_reg_nickname').attr('value');
			
			if($('#form_reg').valid())	
				sendReqRegister(mail,nickname,pass);
	
		});
	
	//LOGIN
	//CALLS THE BUILD REQUEST FUNCTION IF THE TEXTFIELDS ARE NOT EMPTY
	$('#btn_log_logIn').on('click',function()
		{	mail = $('#txt_log_mail').attr('value');
			pass = $('#txt_log_pass').attr('value');	
			
			if(mail&&pass)
				sendReqLogin(mail,pass);
			else
				alert("Mail und Passowrt eingeben!");
		});
	
});