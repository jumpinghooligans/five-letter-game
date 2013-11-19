var devSockets = 'http://localhost';
var herokuSockets = 'http://five-letter-game.herokuapp.com';

$(document).ready(function() {

	var socketInfo = getSocketInfo();
	if(socketInfo.enableSocket) {
		var socket = io.connect(herokuSockets);
		socket.on('connected', function (data) {
			socket.emit('register', socketInfo);
			$("#submitWord").click(function() {
				socket.emit('move', socketInfo);
			});
		});

		socket.on('updateBoard', function(data) {
			updateBoard(data);
		});
	}
});

function updateBoard(data) {
	var sender = data.username;
	var gamename = data.gamename;
	$.get("/games/"+gamename+"/updateboard", { "sender" : sender, "name" : gamename }).done(function(data) {
		alert(data);

		$("#"+sender+" .moves").html("asfa");
	});
}