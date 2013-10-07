exports.gameUsername = function(username) {
	return (username) ? username : "waiting for user"
}

exports.getMoves = function(moves, player) {
	var filtered = [];
	for(var i=0; i<moves.length; i++) {
		if(moves[i].player == player) filtered.push(moves[i]);
	}
	return filtered;
}

exports.getPlayerWord = function(game, player) { 
	return (game["player"+player+"word"].length == 5) ? ".h1 word" : "aasf";
}

exports.getMonthName = function(monthNumber) {
	var monthNames = [
	    "January", "February", "March",
	    "April", "May", "June",
	    "July", "August", "September",
	    "October", "November", "December"
	];

	return monthNames[monthNumber];
}