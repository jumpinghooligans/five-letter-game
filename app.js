
	/**
	* Module dependencies.
	*/

	var express = require('express');

	var routes = require('./routes');
	var user = require('./routes/user');
	var game = require('./routes/game');
	var dev = require('./routes/dev');

	var devDb = 'mongodb://localhost/flg';
	var herokuDb = 'mongodb://rkortmann:dbpassword123@paulo.mongohq.com:10020/app18032920';

	var http = require('http');
	var path = require('path');

	var mongoose = require('mongoose');
	var flash = require('connect-flash');

	var helpers = require('./helpers');

	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());

	app.use(express.session({
		secret: 'yoursecret',
		cookie: {
			maxAge: 1000 * 60 * 24 // 24 hours
		}
	}));

	app.use(flash());
	//middleware to pass session vars to template
	app.use(function(req, res, next) {
		res.locals.username = req.session.username;
		res.locals.user = req.session.user;
		res.locals.helpers = helpers;

		next();
	});
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}

	mongoose.connect(herokuDb);
	//mongoose.connect(devDb);

	var auth = function(req, res, next) {
		if(req.session.username) {
			next();
		} else {
			res.redirect('users/login');
		}
	}

	app.get('/', routes.index);

	//User routes
	app.get('/users', user.list);
	app.get('/users/login', user.login);
	app.get('/users/logout', user.logout);
	app.get('/users/create', user.create);

	app.get('/users/:username', user.user);
	app.get('/users/:username/delete', user.destroy);

	app.post('/users/create', user.create);
	app.post('/users/login', user.login);

	//Game routes
	app.get('/games', auth, game.list);
	app.get('/games/create', auth, game.create);

	app.get('/games/:name', auth, game.game);
	app.get('/games/:name/delete', auth, game.destroy);
	app.get('/games/:name/updateboard', auth, game.updateBoard);

	app.post('/games/create', auth, game.create);
	app.post('/games/:name', auth, game.move);
	app.post('/games/:name/join', auth, game.join);

	//Dev routes
	app.get('/dev/inputtest', dev.inputtest);

	var server = http.createServer(app);

	var io = require('socket.io').listen(server);

	server.listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});

	var currentPlayers = {};
	io.sockets.on('connection', function (socket) {
		socket.emit('connected', { message: 'success' });

		socket.on('register', function(data) {
			console.log(data.username + ' joined the room: ' + data.gamename);
			socket.join(data.gamename);
		});

		socket.on('move', function (data) {
			console.log('broadcast to ' + data.gamename);
			socket.broadcast.to(data.gamename).emit('updateBoard', data);
		});
	});
