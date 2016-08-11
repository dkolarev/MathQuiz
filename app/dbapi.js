//dbapi.js

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var ratingCalculator = require('./ratingCalculator');

var db;
var usersCollection;
var questionsCollection;
var quizzesCollection;


module.exports.connect = function(databaseUrl, callb) {
	mongoClient.connect(databaseUrl, function(err, database) {
		assert.equal(null, err);

		db = database;
		usersCollection = db.collection('users');
		questionsCollection = db.collection('questions');
		quizzesCollection = db.collection('quizzes');

		callb();
	});
};




module.exports.userDataRepository = {
	/**
	*	Funkcija koja vraca korisnike iz baze na osnovu email
	*	adrese.
	*/
	getUserByEmail: function(email) {
		return usersCollection.find({"email": email});
	},

	/**
	*	Funkcija vraca korisnika iz baze na osnovni korisnickog
	*	imena. Napomena: korisnicko ime je jedinstveno za svakog
	*	korisnika u bazi.
	*/
	getUserByUsername: function(username) {
		return usersCollection.findOne({"username": username});
	},

	/**
	*	Funkcija ubacuje novog korisnika u
	*	bazu u kolekciji 'users' nakon sto
	*	je korisnik uspjesno ispunio 'signIn'
	*	formu.
	*/
	insertUser: function(user, cryptedPassword) {
		usersCollection.insert({
			"username": user.username,
			"password": cryptedPassword,
			"email": user.email,
			"joined": new Date().toISOString(),
			"quizList": []
		});	
	}
};




module.exports.questionDataRepository = {
	/**
	*	Funkcija ubacuje novo pitanje u bazu podataka
	*	u kolekciju Questions.
	*/	
	insertQuestion: function(question) {
		return questionsCollection.insertOne({
					"title": question.title,
					"description": question.description,
					"time": question.time,
					"createdBy": question.createdBy,
					"difficulty": question.difficulty,
					"correctAnswer": question.correctAnswer,
					"field": question.field,
					"allAnswers": question.allAnswers,
					"image": question.image,
					"created": question.created,
					"lastModified": question.lastModified
				});
	},

	/**
	*	Funkcija vraca listu svih zadataka iz kolekcije
	*	'questions' u bazi.
	*/
	queryQuestions: function() {
		return questionsCollection.find().toArray();
	},

	getQuestionById: function(questionId) {
		return questionsCollection.findOne({'_id': new ObjectId(questionId)});
	},

	/*
	*	Funkcija azurira vec postojeci zadatak u bazi podataka.
	*/
	updateQuestion: function(question) {
		questionsCollection.updateOne({"_id": new ObjectId (question._id)}, {$set: {
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"difficulty": question.difficulty,
			"correctAnswer": question.correctAnswer,
			"field": question.field,
			"allAnswers": question.allAnswers,
			"image": question.image,
			"lastModified": question.lastModified
		}});
	},

	/**
	*	Funkcija brise pitanje u kolekciji 'questions'. Potrebno je
	*	obrisati pitanje kaskadno i u kolekciji 'quizzes' kako bi se
	*	sacuvao referencijalni integritet.
	*/
	deleteQuestion: function(questionId) {
		questionsCollection.deleteOne({"_id": new ObjectId (questionId)});
	},

	questionListByIds: function(questionIds) {
		var ids = questionIds.map(function(id) { return ObjectId(id); });
		
		return questionsCollection.find({"_id": {$in: ids}});
	}
};




module.exports.quizDataRepository = {
	/**
	*	Funkcija ubacuje novi kviz u bazu.
	*/
	insertQuiz: function(quiz) {
		return quizzesCollection.insertOne({
					"title": quiz.title,
					"description": quiz.description,
					"field": quiz.field,
					"createdBy": quiz.createdBy,
					"created": quiz.created,
					"lastModified": quiz.lastModified,
					"rating": 0,
					"ratingCount": 0,
					"played": 0,
					"questions": quiz.questions
				});
	},

	/**
	*	Funkcija vraca listu svih pitanja u kolekciji 'quizzes'
	*/
	queryQuizzes: function() {
		return quizzesCollection.find().toArray();
	},

	updateQuiz: function(quiz) {
		quizzesCollection.updateOne({"_id": new ObjectId(quiz._id)}, {$set: {
			"title": quiz.title,
			"description": quiz.description,
			"field": quiz.field,
			"lastModified": quiz.lastModified,
			"questions": quiz.questions
		}});	
	},

	/**
	*	Funkcija kvizu s id-om quizId postavlja novu listu s kvizovima. 
	*/
	updateQuizQuestions: function(quizId, questions) {
		quizzesCollection.updateOne({"_id": new ObjectId(quizId)}, {$set: {
			"questions": questions
		}});
	},

	/**
	*	Funkcija brise kviz iz kolekcije 'quizzes'
	*/
	deleteQuiz: function(quizId) {
		quizzesCollection.deleteOne({"_id": new ObjectId (quizId)});
	},

	/**
	*	Funkcija vraca kviz na temelju kljuca.
	*/
	getQuiz: function(quizId) {
		return quizzesCollection.findOne({"_id": new ObjectId (quizId)});
	},

	updateQuizRating: function(quizId, rating) {
		quizzesCollection.findOne({"_id": new ObjectId (quizId)}).then(function(quiz) {
			var newRatingCount = quiz.ratingCount + 1;

			var newRating = ratingCalculator.calculateRating(quiz.rating, quiz.ratingCount, rating);

			quizzesCollection.updateOne({"_id": new ObjectId(quizId)}, {$set: {
			"ratingCount": newRatingCount,
			"rating": newRating
			}});
		});
	},

	/**
	*	Funkcija vraca listu svih kvizova koji sadrze pitanje s questionId
	*	te ga brise iz kvizove liste s pitanjima i radi update kolekcije 'quizzes'.
	*/
	deleteQuestionCascade: function(questionId) {
		quizzesCollection.find({"questions": questionId}).toArray(function(err, documents) {
			for(var quiz of documents) {
				var index = quiz.questions.indexOf(questionId);
				var newQuestionsList = quiz.questions.splice(index, 1);
				updateQuizQuestions(quiz._id, newQuestionsList);
			}
		});
	}
};