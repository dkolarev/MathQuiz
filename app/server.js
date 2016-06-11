//server.js

var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbapi = require('./dbapi');

var path = require('path');

//database connection URL
var dbUrl = 'mongodb://localhost:27017/mathquiz';
//server port
var port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var db; //database instance
var server;	//server instance

mongoClient.connect(dbUrl, function(err, database) {
	assert.equal(null, err);

	db = database;
	server = app.listen(port, function() {
		console.log("DAV listening on port", port);
	});
});