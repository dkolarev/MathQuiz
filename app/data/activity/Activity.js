///Activity.js

module.exports = function(userId, messageId, questionId, quizId) {
	this.userId = userId;
	this.date = new Date().toISOString();
	this.messageId = messageId;
	this.questionId = questionId;
	this.quizId = quizId;
};