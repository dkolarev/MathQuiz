//questionDataRepository.js

var ObjectId = require('mongodb').ObjectID;

module.exports.init = function(db) {
	questionsCollection = db.collection('questions');
};

module.exports.dataRepository = {
	/**
	*	Funkcija ubacuje novo pitanje u bazu podataka
	*	u kolekciju Questions.
	*/	
	insertQuestion: function(question) {
		return questionsCollection.insertOne(question);
	},

	/**
	*	Funkcija vraca listu svih zadataka iz kolekcije
	*	'questions' u bazi.
	*/
	queryQuestions: function() {
		return questionsCollection.find();
	},

	getQuestionById: function(questionId) {
		return questionsCollection.findOne({'_id': new ObjectId(questionId)});
	},

	getQuestionsMetadata: function() {
		return questionsCollection.find({}, {
			'title': true,
			'difficulty': true,
			'field': true,
			'time': true,
			'lastModified': true});
	},

	/*
	*	Funkcija azurira vec postojeci zadatak u bazi podataka.
	*/
	updateQuestion: function(question, callb) {
		return questionsCollection.updateOne({"_id": new ObjectId (question._id)}, {$set: {
				"title": question.title,
				"description": question.description,
				"time": question.time,
				"difficulty": question.difficulty,
				"correctAnswer": question.correctAnswer,
				"field": question.field,
				"allAnswers": question.allAnswers,
				"image": question.image,
				"lastModified": question.lastModified
		}}, callb);
	},

	/**
	*	Funkcija brise pitanje u kolekciji 'questions'. Potrebno je
	*	obrisati pitanje kaskadno i u kolekciji 'quizzes' kako bi se
	*	sacuvao referencijalni integritet.
	*/
	deleteQuestion: function(questionId) {
		return questionsCollection.deleteOne({"_id": new ObjectId (questionId)});
	},

	questionListByIds: function(questionIds) {
		var ids = questionIds.map(function(id) { return ObjectId(id); });
		
		return questionsCollection.find({"_id": {$in: ids}});
	}
};