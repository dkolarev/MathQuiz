//dbapi.js

var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
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

	/**
	*	Funkcija ubacuje novo pitanje u bazu podataka
	*	u kolekciju Questions.
	*/	
	var insertQuestion = function(question) {
		var time = new Date().toISOString();
		questionsCollection.insertOne({
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"createdBy": question.createdBy,
			"difficulty": question.difficulty,
			"correctAnswer": question.correctAnswer,
			"allAnswers": question.allAnswers,
			"imageUrl": question.imageUrl,
			"created": time,
			"lastModified": time
		});
	};

	/**
	*	Funkcija vraca listu svih zadataka iz kolekcije
	*	'questions' u bazi.
	*/
	var queryQuestions = function() {
		return questionsCollection.find().toArray();
	};

	/*
	*	Funkcija azurira vec postojeci zadatak bazi podataka.
	*	Pri tome prvo postovi lastModified atribut na trenutno
	*	vrijeme.
	*/
	var updateQuestion = function(question) {
		var time = new Date().toISOString();
		questionsCollection.updateOne({"_id": new ObjectId (question._id)}, {$set: {
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"createdBy": question.createdBy,
			"difficulty": question.difficulty,
			"correctAnswer": question.correctAnswer,
			"allAnswers": question.allAnswers,
			"imageUrl": question.imageUrl,
			"lastModified": time
		}});
	};


	return {
		getUserByEmail: getUserByEmail,
		getUserByUsername: getUserByUsername,
		insertUser: insertUser,
		insertQuestion: insertQuestion,
		queryQuestions: queryQuestions,
		updateQuestion: updateQuestion
	};
};