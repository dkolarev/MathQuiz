//dbapi.js

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db;
var usersCollection;

/**
*	Inicijalizira bazu
*/
module.exports.setDB = function(database) {
	db = database;
	usersCollection = db.collection('users');
};

module.exports.connect = function(databaseUrl, callb) {
	mongoClient.connect(databaseUrl, function(err, database) {
		assert.equal(null, err);

		db = database;
		usersCollection = db.collection('users');
		
		callb();
	});
};


module.exports.api = function() {
	/**
	*	Funkcija koja provjerava jedinstvenost email
	*	adrese u bazi.
	*/
	var getUserByEmail = function(email) {
		return usersCollection.find({"email": email});
	};

	/**
	*	Funkcija vraca korisnika iz baze na osnovni korisnickog
	*	imena. Napomena: korisnicko ime je jedinstveno za svakog
	*	korisnika u bazi.
	*/
	var getUserByUsername = function(username) {
		return usersCollection.findOne({"username": username});
	};

	/**
	*	Funkcija ubacuje novog korisnika u
	*	bazu u kolekciji 'users' nakon sto
	*	je korisnik uspjesno ispunio 'signIn'
	*	formu.
	*/
	var insertUser = function(user, cryptedPassword) {
		usersCollection.insert({
			"username": user.username,
			"password": cryptedPassword,
			"email": user.email,
			"quizList": []
		});	
	};

	var insertQuestion = function(question) {
		var questions = db.collection('questions');
		questions.insert({
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"correct": question.correct,
			"createdBy": question.createdBy,
			"difficulty": question.difficulty,
			"answers": question.answers
		});
	};


	return {
		getUserByEmail: getUserByEmail,
		getUserByUsername: getUserByUsername,
		insertUser: insertUser,
		insertQuestion: insertQuestion
	};
};