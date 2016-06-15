//dbapi.js

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db;
var usersCollection;
var questionsCollection;

module.exports.connect = function(databaseUrl, callb) {
	mongoClient.connect(databaseUrl, function(err, database) {
		assert.equal(null, err);

		db = database;
		usersCollection = db.collection('users');
		questionsCollection = db.collection('questions');

		callb();
	});
};


module.exports.api = function() {
	/**
	*	Funkcija koja vraca korisnike iz baze na osnovu email
	*	adrese.
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
			"joined": new Date().toISOString(),
			"quizList": []
		});	
	};

	var insertQuestion = function(question) {
		var time = new Date().toISOString();
		questionsCollection.insert({
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"createdBy": question.createdBy,
			"difficulty": question.difficulty,
			"correctAnswer": question.correctAnswer,
			"allAnswers": question.allAnswers,
			"created": time,
			"lastModified": time
		});
	};

	var queryQuestions = function() {
		return questionsCollection.find().toArray();
	};


	return {
		getUserByEmail: getUserByEmail,
		getUserByUsername: getUserByUsername,
		insertUser: insertUser,
		insertQuestion: insertQuestion,
		queryQuestions: queryQuestions
	};
};