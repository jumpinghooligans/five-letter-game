/*
 * GET games page.
 */
var User = require("../models/user.js");
var Game = require("../models/game.js");
var Helpers = require("../helpers");
var eventEmitter = new (require('events').EventEmitter)();

exports.Events = eventEmitter;

exports.list = function (req, res) {
	var username = req.session.username;
	var yourgames = null;
	var othergames = null;

	//good old async event nesting
	Game.find({ $or: [{ player1: username }, {player2: username }]}, function (err, _yourgames) {
		yourgames = _yourgames;
		complete();
	});
	Game.find({$and: [{ player1: { $ne: username }}, { player2: { $ne: username }}]}, function (err, _othergames) {
		othergames = _othergames;
		complete();
	});

	var complete = function() {
		if((yourgames) && (othergames)) {
			res.render('game/index', { 	
				yourgames : yourgames,
			 	othergames : othergames,
			 	errors : req.flash('errors')
			});
		}
	}
}

exports.create = function(req, res) {
	if(req.method == "POST") {
		new Game( {name: req.body.gamename, player1: req.session.username }).save(function (err, game) {
			if(!err) {
				res.redirect('games/' + req.body.gamename.toLowerCase());
			} else {
				res.send("Game name already exists.");
			}
		});
	} else {
		res.render('game/create');
	}
}

exports.destroy = function (req, res) {
	var gamename = req.params.name;

	Game.findOne({name : gamename}, function (err, game) {
		if((req.session.username == game.player1) || (req.session.username == game.player2) || (req.session.username == 'admin')) {
			Game.remove({_id : game._id}, function(err, game) {
				req.flash('errors', err);
				res.redirect('games');
			});
		} else {
			req.flash('errors', ['You are not an owner of this game.']);
			res.redirect('games/' + gamename);
		}
	});
}

exports.game = function(req, res) {
	Game.findOne({ name : req.params.name}, function (err, game) {
		if(game) {
			res.render('game/game', { game: game, errors : req.flash('errors')});
			return;
		} else {
			req.flash('errors', ['That game does not exists.']);
			res.redirect('games');
		}
	});
}

exports.move = function (req, res) {
	var gamename = req.params.name;
	var playername = req.session.username;
	var word = req.body.word;

	Game.findOne({ name : gamename }, function(err, game) {

		//if both words aren't set, attempt to use this action to set them
		if((!game.player1word) || (!game.player2word)) {
			if((game.player1 == playername) && (!game.player1word)) {
				var set = { player1word : word };

				Game.update(game, { $set : set }, function(error) {
					eventEmitter.emit("player_picked_word", { "sender" : game.player1, "game" : game.name, "word" : word });
					console.log("set user: " + game.player1 + " word to " + word);
				});
			} else if((game.player2 == playername) && (!game.player2word)) {
				var set = { player2word : word };

				Game.update(game, { $set : set }, function(error) {
					eventEmitter.emit("player_picked_word", { "sender" : game.player2, "game" : game.name, "word" : word });
					console.log("set user: " + game.player2 + " word to " + word);
				});
			} else {
				req.flash('errors', ['You do not have permission to do that.']);
			}
			res.redirect(req.url);
		} else {

			console.log('both words set, move is now a guess.')
			console.log(game);

			//more sophisticated word check to come
			if(word.length == 5) {
				var next_move = {};

				if(game.words.length % 2 == 0) {

					//player1's turn
					if(game.player1 == playername) {

						next_move.player = playername;
						next_move.word = word;
						next_move.letters = Helpers.getLetters(word, game.player2word);
						next_move.positions = Helpers.getPositions(word, game.player2word);

					} else {
						req.flash('errors', ['It is not your turn.']);
						res.redirect(req.url);
						return;
					}

				} else {

					//player2's turn
					if(game.player2 == playername) {

						next_move.player = playername;
						next_move.word = word;
						next_move.letters = Helpers.getLetters(word, game.player1word);
						next_move.positions = Helpers.getPositions(word, game.player1word);

					} else {
						req.flash('errors', ['It is not your turn.']);
						res.redirect(req.url);
						return;
					}

				}

				Game.update(game, {$push : {words : next_move}}, function (err, rows) {
					console.log("player_move event sent");
					eventEmitter.emit("player_move", { "sender" : playername, "game": game.name });

					req.flash('errors', err);
					res.redirect(req.url);
					return;
				});
			} else {
				req.flash('errors', ['Invalid word entered.']);
				res.redirect(req.url);
				return;
			}
		}
	});
}

exports.join = function (req, res) {

	console.log(req.session.username + ' wants to join ' + req.params.name);

	var gameurl = req.headers.referer;

	Game.findOne({ name : req.params.name }, function(err, game) {


		if((game.player1) && (game.player2)){
			req.flash('errors', ['This game already has two players.']);
			res.redirect(gameurl);
			return;
		}

		if(game.player1 == req.session.username) {
			req.flash('errors', ['You are already in this game.']);
			res.redirect(gameurl);
			return;
		}

		//set this guy as player2
		var set = {player2 : req.session.username};
		Game.update(game, {$set : set}, function(err){
			console.log('success.');

			console.log("player_joined event sent");
			eventEmitter.emit("player_joined", { "sender" : req.session.username, "player1" : game.player1, "game": game.name });

			res.redirect(gameurl);
			return;
		});

	});

}

exports.updateBoard = function(req, res) {
	Game.findOne({ name : req.query.name }, function(err, game) {
		res.render('game/moves', { player : req.query.sender, game : game });
	})
}

exports.updatePlayer = function(req, res) {
	Game.findOne({ name : req.query.name }, function(err, game) {
		res.render('game/newplayer', { player : req.query.sender, game : game });
	})
}
