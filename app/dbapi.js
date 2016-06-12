//dbapi.js

var db;

/**
*	Inicijalizira bazu
*/
module.exports.setDB = function(database) {
	db = database;
};


module.exports.api = function() {
	/**
	*	Funkcija koja provjerava jedinstvenost korisnickog
	*	imena u bazi. Funkcija vraca promise.
	*/
	var checkUsernameAvailability = function(username){
		var cursor = db.collection('users').find({"username": username});
		return cursor.count(); //count vraca promise
	};

	var insertUser = function(user) {
		var users = db.collection('users');
		users.insert({
			"username": user.username,
			"password": user.password,
			"email": user.email,
			"quizList": []
		});	
	};

	var insertQuestion = function(question) {
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


	return {
		checkUsernameAvailability: checkUsernameAvailability,
		insertUser: insertUser,
		insertQuestion: insertQuestion
	};
};