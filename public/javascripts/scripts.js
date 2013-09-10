$(document).ready(function () {
	
	$('.guess input').keyup(function(e){
		if(e.keyCode == 8)
			$(this).prev('input').select();

    	if(String.fromCharCode(e.keyCode).match(/\w/))
	    	$(this).next('input').focus();
	})


})
