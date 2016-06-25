//dbapi.js

var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

var db;
var usersCollection;
var questionsCollection;
var quizzesCollection;

var ActiveQuizzes = [];

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
		return questionsCollection.insertOne({
					"title": question.title,
					"description": question.description,
					"time": question.time,
					"createdBy": question.createdBy,
					"difficulty": question.difficulty,
					"correctAnswer": question.correctAnswer,
					"allAnswers": question.allAnswers,
					"imageUrl": question.imageUrl,
					"created": question.created,
					"lastModified": question.lastModified
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
	*	Funkcija azurira vec postojeci zadatak u bazi podataka.
	*/
	var updateQuestion = function(question) {
		questionsCollection.updateOne({"_id": new ObjectId (question._id)}, {$set: {
			"title": question.title,
			"description": question.description,
			"time": question.time,
			"difficulty": question.difficulty,
			"correctAnswer": question.correctAnswer,
			"allAnswers": question.allAnswers,
			"imageUrl": question.imageUrl,
			"lastModified": question.lastModified
		}});
	};

	/**
	*	Funkcija vraca listu svih kvizova koji sadrze pitanje s questionId
	*	te ga brise iz kvizove liste s pitanjima i radi update kolekcije 'quizzes'.
	*/
	var deleteQuestionCascade = function(questionId) {
		quizzesCollection.find({"questions": questionId}).toArray(function(err, documents) {
			for(var quiz of documents) {
				var index = quiz.questions.indexOf(questionId);
				var newQuestionsList = quiz.questions.splice(index, 1);
				updateQuizQuestions(quiz._id, newQuestionsList);
			}
		});
	};

	/**
	*	Funkcija brise pitanje u kolekciji 'questions'. Potrebno je
	*	obrisati pitanje kaskadno i u kolekciji 'quizzes' kako bi se
	*	sacuvao referencijalni integritet.
	*/
	var deleteQuestion = function(questionId) {
		deleteQuestionCascade(questionId);
		questionsCollection.deleteOne({"_id": new ObjectId (questionId)});
	};

	/**
	*	Funkcija ubacuje novi kviz u bazu.
	*/
	var insertQuiz = function(quiz) {
		return quizzesCollection.insertOne({
					"title": quiz.title,
					"description": quiz.description,
					"field": quiz.field,
					"createdBy": quiz.createdBy,
					"created": quiz.created,
					"lastModified": quiz.lastModified,
					"questions": quiz.questions
				});
	};

	/**
	*	Funkcija vraca listu svih pitanja u kolekciji 'quizzes'
	*/
	var queryQuizzes = function() {
		return quizzesCollection.find().toArray();
	};

	var updateQuiz = function(quiz) {
		quizzesCollection.updateOne({"_id": new ObjectId(quiz._id)}, {$set: {
			"title": quiz.title,
			"description": quiz.description,
			"field": quiz.field,
			"lastModified": quiz.lastModified,
			"questions": quiz.questions
		}});	
	};

	/**
	*	Funkcija kvizu s id-om quizId postavlja novu listu s kvizovima. 
	*/
	var updateQuizQuestions = function(quizId, questions) {
		quizzesCollection.updateOne({"_id": new ObjectId(quizId)}, {$set: {
			"questions": questions
		}});
	};

	/*
	*	Funkcija brise kviz iz kolekcije 'quizzes'
	*/
	var deleteQuiz = function(quizId) {
		quizzesCollection.deleteOne({"_id": new ObjectId (quizId)});
	};

	var getQuiz = function(quizId) {
		return quizzesCollection.findOne({"_id": new ObjectId (quizId)});
	};

	var activateQuiz = function(quiz) {
		ActiveQuizzes.push(quiz);
	};

	var verifyGameId = function(gameId) {
		var quiz = ActiveQuizzes.filter(function(quiz) {
				 		return quiz.gameId == gameId;
					});

		return quiz;
	};	

	return {
		getUserByEmail: getUserByEmail,
		getUserByUsername: getUserByUsername,
		insertUser: insertUser,
		insertQuestion: insertQuestion,
		queryQuestions: queryQuestions,
		updateQuestion: updateQuestion,
		deleteQuestion: deleteQuestion,
		insertQuiz: insertQuiz,
		queryQuizzes: queryQuizzes,
		updateQuiz: updateQuiz,
		deleteQuiz: deleteQuiz,
		getQuiz: getQuiz,
		activateQuiz: activateQuiz,
		verifyGameId: verifyGameId
	};
};