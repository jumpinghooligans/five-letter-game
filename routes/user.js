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
			res.render("user/user", { thisUser : user })
		} else {
			res.send("Username: " + req.params.username + " not found in database.");
		}
	});
}

exports.login = function (req, res) {
	if(req.method == "POST") {
		User.findOne({username: req.body.username, password: req.body.password }, function(err, user) {
			if(user) {
				req.session.user = user;
				res.redirect('/');
			} else {
				req.flash('errors', 'Incorrect username or password.');
				res.redirect('users/login');
			}
		})
	} else {
		res.render("user/login", {errors : []});
	}
}

exports.logout = function(req, res) {
	console.log("logged out: " + req.session.user.username);
	console.log(req.session);
	req.session.destroy();

	res.redirect('/');
}

exports.create = function (req, res) {
	if(req.method == "POST") {
		new User({ username : req.body.username, password: req.body.password, email: req.body.email }).save(function (err, user) {
			if(!err) {
				req.session.user = user;
				res.redirect("/");
			} else {
				console.log("create user error: " + err);
				res.render("user/create", {errors : [err]});
			}
		});
	} else {
		res.render("user/create");
	}
}

exports.destroy = function (req, res) {
	var userToDelete = req.params.username;
	var user = req.session.user;

	if((user) && (userToDelete) && ((user.username == userToDelete) || (user.username == "admin"))) {
		Game.remove({ $or: [{player1 : userToDelete}, {player2 : userToDelete}]}, function (){});

		User.remove({ username: userToDelete }, function(){
			if(user.username == userToDelete) {
				res.redirect('/users/logout');
			} else {
				res.redirect('/users');
			}
		});

	} else {
		req.flash('errors', 'You cannot do that.');
		res.redirect('users')
	}
}