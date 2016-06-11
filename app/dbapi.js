//dbapi.js


module.exports.insertUser = function(user, db) {
	var users = db.collection('users');
	users.insert({
		"username": user.username,
		"password": user.password,
		"email": user.email,
		"quizList": []
	});	
};

module.exports.insertQuestion = function(question, db) {
	var questions = db.collection('questions');
	questions.insert({
		"title": question.title,
		"description": question.description,
		"time": question.time,
		"correct": question.correct,
		"createdBy": question.createdBy,
		"difficulty": question.difficulty,
		"answers": question.answers
	});
};

module.exports.deleteQuestion = function(question, db) {

};

module.exports.createQuiz = function(quiz, db) {

};