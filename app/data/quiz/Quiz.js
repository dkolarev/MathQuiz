//Quiz.js

var Quiz = function(quiz) {
	this.title = quiz.title;
	this.description = quiz.description;
	this.field = quiz.field;
	this.createdBy = quiz.createdBy;
	this.created = quiz.created;
	this.lastModified = quiz.lastModified;
	this.rating = quiz.rating;
	this.ratingCount = quiz.ratingCount;
	this.played = quiz.played;
	this.questions = quiz.questions;
};

Quiz.prototype.changeCreatedTime = function(time) {
	this.created = time;
};

Quiz.prototype.changeModifiedTime = function(time) {
	this.lastModified = time;
};

module.exports = Quiz;