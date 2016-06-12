//server.js

var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var path = require('path');
var checkRoute = require('./routes/checkRoute');


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


mongoClient.connect(dbUrl, function(err, database) {
	assert.equal(null, err);

	db = database;
	require('./dbapi').setDB(db); //proslijedi instancu baze
	server = app.listen(port, function() {
		console.log("DAV listening on port", port);
	});
});

app.use('/check', checkRoute);

app.use('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});