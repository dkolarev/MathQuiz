//dbapi.js

var db;
var usersCollection;

/**
*	Inicijalizira bazu
*/
module.exports.setDB = function(database) {
	db = database;
	usersCollection = db.collection('users');
};


module.exports.api = function() {
	/**
	*	Funkcija koja provjerava jedinstvenost korisnickog
	*	imena u bazi. Funkcija vraca promise.
	*/
	var checkUsernameAvailability = function(username){
		var cursor = usersCollection.find({"username": username});
		return cursor.count(); //count vraca promise
	};

	/**
	*	Funkcija koja provjerava jedinstvenost email
	*	adrese u bazi. Funkcija vraca promise.
	*/
	var checkEmailAvailability = function(email) {
		var cursor = usersCollection.find({"email": email});
		return cursor.count();
	}

	/**
	*	Funkcija ubacuje novog korisnika u
	*	bazu u kolekciji 'users' nakon sto
	*	je korisnik uspjesno ispunio 'signIn'
	*	formu.
	*/
	var insertUser = function(user) {
		usersCollection.insert({
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
		checkEmailAvailability: checkEmailAvailability,
		insertUser: insertUser,
		insertQuestion: insertQuestion
	};
};