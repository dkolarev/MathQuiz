//server.js

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var helmet = require('helmet');
var authRoute = require('./routes/authRoute');
var questionRoute = require('./routes/questionRoute');
var quizRoute = require('./routes/quizRoute');
var gameRoute = require('./routes/gameRoute');
var validateRoute = require('./routes/validateRoute');
var userRoute = require('./routes/userRoute');
var config = require('./config/config');
var db = require('./config/db');

//database connection URL
var dbUrl = config.db;
//server port
var port = config.port;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, config.root)));

app.use(helmet());
app.disable('x-powered-by');

var server;	//server instance
var io; //socket instance

db.connect(config, function() {
	server = app.listen(config.port, function() {
		console.log("DAV listening on port", config.port);
	});

	io = require('socket.io')(server);
	app.set('socketio', io);
	require('./scripts/gameSocketService').setSocket(io);
});

app.use('/api/auth', authRoute);
app.use('/api/validate', validateRoute);
app.use('/api/question', questionRoute);
app.use('/api/quiz', quizRoute);
app.use('/api/user', userRoute);
app.use('/api/game', gameRoute);

app.use('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});