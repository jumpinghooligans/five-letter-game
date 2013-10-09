$(document).ready(function () {

	$('#header a[href="' + $(location).attr('pathname') + '"]').addClass('active');

	if($("#input").length > 0) {
		console.log("input found");

		$(document).bind("click", function(e) {
			console.log("click");

			//unbindInput();
			$("#input").removeClass("active");
		});

		$("#input").bind("click", function(e) {
			console.log("input clicked");

			//bindInput();
			$("#input").addClass("active");
			e.stopPropagation();
		});

	}

});

/*function bindInput() {
	console.log("bind");
	unbindInput();
	$(window).bind("keydown keypress", function(e) {
		$('input[name="word"]').val($("#input").text());
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
}

function unbindInput() {
	console.log("unbind");
	$(window).unbind("keydown");
	$(window).unbind("keypress");
	$(window).unbind("keyup");
}
*/