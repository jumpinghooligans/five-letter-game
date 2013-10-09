
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
		res.locals.helpers = require('./helpers');

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

	app.post('/games/create', auth, game.create);
	app.post('/games/:name', auth, game.move);

	//Dev routes
	app.get('/dev/inputtest', dev.inputtest);

	http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	});
