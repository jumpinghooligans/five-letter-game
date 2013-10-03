/*
 * GET games page.
 */
var User = require("../models/user.js");
var Game = require("../models/game.js");

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
			res.render('game/index', { 	yourgames : yourgames,
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
			req.flash('errors', 'You are not an owner of this game.');
			res.redirect('games/' + gamename);
		}
	});
}

exports.game = function(req, res) {
	Game.findOne({ name : req.params.name}, function (err, game) {
		res.render('game/game', { game: game, errors : req.flash('errors')});
	});
}

exports.move = function (req, res) {
	if(req.body.action == 'newword') {
		var set = {};
		set[req.body.player+'word'] = req.body.word;

		Game.update({name : req.body.name},
					{ $set : set}, function (err, move) {
						req.flash('errors', err);
						Game.findOne({name : req.body.name}, function(err, game) {
							if((game.player1word.length == 5) && (game.player2word.length == 5)) {
								Game.update({name : req.body.name},
											{stage : 'guess'}, function (err, game) {
												req.flash('errors', err);
												res.redirect('games/' + req.body.name);
											});
							} else {
								res.redirect('games/' + req.body.name);
							}
						});
					});
	} else {
		var word = req.body[0] + req.body[1] + req.body[2] + req.body[3] + req.body[4];

		if(req.body.player == req.session.username) {
			console.log(req.body.player + ' made a move.');
			console.log(JSON.stringify( {words : { player : req.body.player, word : word }} ));
			Game.update({name : req.body.name},
						{$push : {words : { player : req.body.player, word : word }}}, function (err, move) {
							console.log("errors: " + err);
							req.flash('errors', err);
						});
		} else {
			console.log("Username mismatch. " + req.session.username + " tried submitting a word for " + req.body.player);
			req.flash('errors', ['You cannot do that.']);
		}

		res.redirect('games/' + req.body.name);
	}
}

