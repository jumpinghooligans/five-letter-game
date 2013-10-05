$(document).ready(function () {
	
	$('.guess input').keyup(function(e){
		if(e.keyCode == 8)
			$(this).prev('input').select();

    	if(String.fromCharCode(e.keyCode).match(/\w/))
	    	$(this).next('input').focus();
	});

	$(window).bind("keydown keypress", function(e) {
		if(e.keyCode == 8) {
			e.preventDefault();
			$("#input").text($("#input").text().substring(0, $("#input").text().length-1));
		}
	});

	$(window).bind("keyup", function(e) {
		if(String.fromCharCode(e.keyCode).match(/\w/)) {
			$("#input").append("<span class='new'>" + String.fromCharCode(e.keyCode) + "</span>");
			$("#input .new").fadeIn(300, function() {
				$("#input .new").contents().unwrap();
			});
		}
	});

	$("#input_container .input").click(function(e) {
		$(this).addClass("active");
	});


});
