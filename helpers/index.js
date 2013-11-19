exports.gameUsername = function(username) {
	return (username) ? username : "waiting for user"
}

exports.getMoves = function(moves, player) {
	console.log('getMoves: filtering ' + moves.length + ' moves for ' + player);
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

exports.getLetters = function (guess, word) {
	var count = 0;
	for(var i=0; i<guess.length; i++) {
		if(word.indexOf(guess.charAt(i)) != -1) {
			count++;
		}
	}

	return count;
}

exports.getPositions = function (guess, word) {
	var count = 0;
	for(var i=0; i<guess.length; i++) {
		if(guess.charAt(i) == word.charAt(i)) {
			count++;
		}
	}

	return count;
}

exports.shouldOpenSocket = function(game) {
	return ((game.player1) && (game.player2)) ? true : false;
}

exports.getTarget = function(game, user) {
	return (game.player1 == user) ? game.player2 : game.player1;
}