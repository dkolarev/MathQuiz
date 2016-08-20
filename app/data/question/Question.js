//Question.js

var Question = function(question) {
	this._id = question._id;
	this.title = question.title;
	this.description = question.description;
	this.time = question.time;
	this.createdBy = question.createdBy;
	this.difficulty = question.difficulty;
	this.correctAnswer = question.correctAnswer;
	this.field = question.field;
	this.allAnswers = question.allAnswers;
	this.image = question.image;
	this.created = question.created;
	this.lastModified = question.lastModified;
};

Question.prototype.changeCreatedTime = function(time) {
	this.created = time;
};

Question.prototype.changeModifiedTime = function(time) {
	this.lastModified = time;
};

module.exports = Question;