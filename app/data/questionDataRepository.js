//questionDataRepository.js

var ObjectId = require('mongodb').ObjectID;

var questionsCollection = db.collection('questions');

module.exports = {
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
	}
};