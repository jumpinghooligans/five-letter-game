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