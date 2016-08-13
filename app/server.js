//server.js

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');
var unauthRoute = require('./routes/unauthRoute');
var questionRoute = require('./routes/questionRoute');
var quizRoute = require('./routes/quizRoute');
var gameRoute = require('./routes/gameRoute');
var secureRoute = require('./routes/secureRoute');
var dbapi = require('./data/dbapi');

//database connection URL
var dbUrl = 'mongodb://localhost:27017/mathquiz';
var mlab = 'mongodb://dkolarev:dkolarev2016@ds013024.mlab.com:13024/projects';
//server port
var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.disable('x-powered-by');

var server;	//server instance
var io; //socket instance

dbapi.connect(dbUrl, function() {
	//pokreni aplikaciju
	server = app.listen(port, function() {
		console.log("DAV listening on port ", port);
	});

	io = require('socket.io')(server);
	app.set('socketio', io);
});	

app.use('/auth', unauthRoute);
app.use('/api', secureRoute);
app.use('/api/question', questionRoute);
app.use('/api/quiz', quizRoute);
app.use('/game', gameRoute);

app.use('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});