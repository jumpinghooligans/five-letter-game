
/*
 * GET users listing.
 */
var User = require("../models/user.js");
var Game = require("../models/game.js");

exports.list = function(req, res){
	//res.render("user/index");
	User.find(function(err, users) {
		res.render("user/index", {users : users, errors : req.flash('errors')});
	});
};

exports.user = function (req, res) {
	
	User.findOne({username: req.params.username}, function(err, user) {
		if(user) {
			res.render("user/user", { user : user })
		} else {
			res.send("Username: " + req.params.username + " not found in database.");
		}
	});
}

exports.login = function (req, res) {
	if(req.method == "POST") {
		User.findOne({username: req.body.username, password: req.body.password }, function(err, user) {
			if(user) {
				req.session.username = user.username;
				res.redirect('/');
			} else {
				req.flash('errors', 'Incorrect username or password.');
				res.redirect('users/login');
			}
		})
	} else {
		res.render("user/login", {errors : req.flash('errors')});
	}
}

exports.logout = function(req, res) {
	console.log(req.params.username);
	delete req.session.username;
	res.redirect('/');
}

exports.create = function (req, res) {
	if(req.method == "POST") {
		new User({ username : req.body.username, password: req.body.password }).save(function (err, user) {
			if(!err) {
				req.session.username = req.body.username;
				res.redirect("/");
			} else {
				res.render("user/create", {error : err});
			}
		});
	} else {
		res.render("user/create");
	}
}

exports.destroy = function (req, res) {
	var username = req.params.username;

	if((req.session.username) && ((req.session.username == username) || (req.session.username == "admin"))) {
		User.remove({ username: username }, function(){});
		Game.remove({ $or: [{player1 : username}, {player2 : username}]}, function (){});

		res.redirect('/users/logout');
	} else {
		req.flash('errors', 'You cannot do that.');
		res.redirect('users')
	}
}