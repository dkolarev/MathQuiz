//server.js

var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
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


var db; //database instance
var server;	//server instance

//spoji se na bazu i pokreni server
dbapi.connect(dbUrl, function() {
	server = app.listen(port, function() {
		console.log("DAV listening on port ", port);
	});
});


app.use('/auth', unauthRoute);
app.use('/api', apiRoute);

app.use('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});