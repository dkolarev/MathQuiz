//quizDataRepository.js

var ObjectId = require('mongodb').ObjectID;

var quizCollection;

module.exports.init = function(db) {
	quizCollection = db.collection('quizzes');
};

/**
*	Funkcija kvizu s id-om quizId postavlja novu listu s kvizovima. 
*/
var updateQuizQuestions = function(quizId, newQuestions) {
	return quizCollection.updateOne({"_id": new ObjectId(quizId)}, {$set: {
		questions: newQuestions
	}});
};

module.exports.dataRepository = {
	/**
	*	Funkcija ubacuje novi kviz u bazu.
	*/
	insertQuiz: function(quiz) {
		return quizCollection.insertOne(quiz);
	},

	/**
	*	Funkcija vraca listu svih pitanja u kolekciji 'quizzes'
	*/
	queryQuizzes: function() {
		return quizCollection.find();
	},

	getQuizListMetadata: function() {
		return quizCollection.find({}, {
			"title": true,
			"field": true,
			"lastModified": true,
			"createdBy": true,
			"rating": true
		});
	},

	updateQuiz: function(quiz, callb) {
		quizCollection.updateOne({"_id": new ObjectId(quiz._id)}, {$set: {
			"title": quiz.title,
			"description": quiz.description,
			"field": quiz.field,
			"lastModified": quiz.lastModified,
			"questions": quiz.questions
		}}, callb);	
	},

	/**
	*	Funkcija brise kviz iz kolekcije 'quizzes'
	*/
	deleteQuiz: function(quizId) {
		return quizCollection.deleteOne({"_id": new ObjectId (quizId)});
	},

	/**
	*	Funkcija vraca kviz na temelju kljuca.
	*/
	getQuiz: function(quizId) {
		return quizCollection.findOne({"_id": new ObjectId (quizId)});
	},

	updateQuizRating: function(quizId, newRatingCount, newRating) {
		return quizCollection.updateOne({"_id": new ObjectId(quizId)}, {$set: {
				"ratingCount": newRatingCount,
				"rating": newRating
		}});
	},

	/**
	*	Funkcija vraca listu svih kvizova koji sadrze pitanje s questionId
	*	te ga brise iz kvizove liste s pitanjima i radi update kolekcije 'quizzes'.
	*/
	deleteQuestionCascade: function(questionId) {
		quizCollection.find({"questions": questionId}).toArray(function(err, documents) {
			for(var quiz of documents) {
				var index = quiz.questions.indexOf(questionId);
				quiz.questions.splice(index, 1);
				updateQuizQuestions(quiz._id, quiz.questions);
			}
		});
	},

	updateQuizPlayedCounter: function(quizId) {
		return quizCollection.updateOne({"_id": new ObjectId(quizId)}, { $inc: {
					"played": 1
		}});
	}
};