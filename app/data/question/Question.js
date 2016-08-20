//Question.js

var Question = function(question) {
	this.title = question.title;
	this.description = question.description;
	this.time = question.time;
	this.createdBy = question.createdBy;
	this.difficulty = question.difficulty;
	this.correctAnswer = question.correctAnswer;
	this.field = question.field;
	this.allAnswers = question.allAnwers;
	this.image = question.image;
	this.created = question.created;
	this.lastModified = question.lastModified;
};

module.exports = Question;