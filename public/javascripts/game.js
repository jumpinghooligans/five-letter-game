

$(document).ready(function() {

	var socketInfo = getSocketInfo();

	var socket = io.connect(window.location.hostname);

	socket.on('connected', function (data) {
		socket.emit('register', socketInfo);
	});

	socket.on('player_move', update_moves);
	socket.on('player_joined', player_joined);
	socket.on('player_picked_word', player_picked_word);
});

function update_moves(data) {
	var sender = data.sender;
	var gamename = data.game;
	$.get("/games/"+gamename+"/updateboard", { "sender" : sender, "name" : gamename }).done(function(data) {
		$("#"+sender+" .moves").html(data);
	});
}

function player_joined(data) {
	var sender = data.sender;
	var player1 = data.player1;
	var gamename = data.game;
	$.get("/games/"+gamename+"/updatePlayer", { "sender" : sender }).done(function(data) {
		$("#undefined .name").replaceWith(data);
	});
}

function player_picked_word(data) {
	var sender = data.sender;
	var gamename = data.game;
	var word = data.word;
	$("#" + sender + " .word").html(word);
}