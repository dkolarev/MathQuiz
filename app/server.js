//server.js

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var unauthRoute = require('./routes/unauthRoute');
var apiRoute = require('./routes/apiRoute');
var dbapi = require('./dbapi');


//database connection URL
var dbUrl = 'mongodb://localhost:27017/mathquiz';
var mlab = 'mongodb://dkolarev:dkolarev2016@ds013024.mlab.com:13024/projects';
//server port
var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


var server;	//server instance
var io;

//spoji se na bazu i pokreni server
dbapi.connect(dbUrl, function() {
	server = app.listen(port, function() {
		console.log("DAV listening on port ", port);
	});
	io = require('socket.io')(server);
	app.set('socketio', io);
});


app.use('/auth', unauthRoute);
app.use('/api', apiRoute);

app.use('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});