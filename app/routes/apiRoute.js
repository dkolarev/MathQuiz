//apiRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var dbapi = require('../dbapi').api();

var router = express.Router();


var secret = '1234';

var socket;

router.use(function(req, res, next) {
	var token = req.query.token || req.headers['x-auth-token'];
	if (token) {
		jwt.verify(token, secret, function(err, decode) {
			if (err) {
				return res.status(401).json({
					success: false,
					message: 'Wrong token'
				});
			} else {
				next();
			}
		});
	} else {
		return res.status(401).send({
			success: false,
			message: 'No token given'
		});
	}
});

/**
*	Posalji podatke iz baze korisnika.
*/
router.get('/getdata', function (req, res) {
	dbapi.queryQuestions().then(function (questions) {
		dbapi.queryQuizzes().then(function(quizzes) {
			res.setHeader('Content-Type', 'application/json');
			res.send({
				"questionsList": questions,
				"quizzesList": quizzes
			});
		});
	});
});



/**
*	Ruta za spremanje pitanja. Ako pitanje vec
*	sadrzi atribut id, koji mu dodjeljuje baza automatski,
*	onda znaci da je napravljen update vec postojeceg pitanja
*	te u tom slucaju izvrsi update u bazi. U suprotnom postavi
*	novo pitanje u bazu.
*/
router.post('/savequestion', function(req, res) {
	var question = req.body;
	var socketio = req.app.get('socketio');
	var currentTime = new Date().toISOString();

	//ako pitanje ima atribut id onda radi update
	if(question._id) {
		question.lastModified = currentTime;
		
		dbapi.updateQuestion(question);

		socketio.emit('updateQuestion', question);
	} else {
		question.created = currentTime;
		question.lastModified = currentTime;
		
		dbapi.insertQuestion(question).then(function(doc) {
			socketio.emit('newQuestion', doc.ops[0]);
		});
	}

	res.end();
});


/**
*	Ruta za brisanje pitanja u bazi.
*/
router.get('/deletequestion/:questionId', function(req, res) {
	var questionId = req.params.questionId;
	var socketio = req.app.get('socketio');
	if(questionId) {
		dbapi.deleteQuestion(questionId);
		socketio.emit('deleteQuestion', {
			"questionId": questionId
		});
	}
	res.end();
});


/**
*	Ruta za spremanje kviza. Ako kviz sadrzi id
*	znaci da se radio o update kviza jer kviz ima id
*	tek kad dospije u bazu. U suprotnom sprema se novi
*	kviz.
*/
router.post('/savequiz', function(req, res) {
	var quiz = req.body;
	var socketio = req.app.get('socketio');
	var currentTime = new Date().toISOString();

	if(quiz._id) {
		quiz.lastModified = currentTime;

		dbapi.updateQuiz(quiz);

		socketio.emit('updateQuiz', quiz);
	} else {
		quiz.created = currentTime;
		quiz.lastModified = currentTime;

		dbapi.insertQuiz(quiz).then(function(doc) {
			socketio.emit('newQuiz', doc.ops[0]);
		});
	}

	res.end();
});


/**
*	Ruta za brisanje kviza. Korisnik salje id kviza
*	koji zeli obrisati.
*/
router.get('/deletequiz/:quizId', function(req, res) {
	var quizId = req.params.quizId;
	var socketio = req.app.get('socketio');
	if(quizId) {
		dbapi.deleteQuiz(quizId);

		socketio.emit('deleteQuiz', {
			"quizId": quizId
		});
	}
	res.end();
});

/**
*	Ruta za aktiviranje kviza. Kada korisnik aktivira kviz
*	trenutno stanje kviza se premjesta u listu sa aktivnim
*	kvizovima koja se nalazi u RAM-u. Kako ne bi doslo do
*	nezeljenih promjena na zadacima tijekom kviza, u istom
*	trenutku se kopiraju i zadaci. Svaki kviz ili igra je
*	identificirana sa hash kodom koji je jedinstven za svaku
*	igru i koristi se za pristup igraca svakom kvizu.
*/
router.get('/startquiz/:quizId', function(req, res) {
	var quizId = req.params.quizId;
	dbapi.getQuiz(quizId).then(function(quiz) {
		/**
		*	Kreiraj jedinstveni nasumicni id aktivnog kviza
		*	koji se ponasa kao token za pristup igraca.
		*/
		var gameId = crypto.randomBytes(4).toString('hex');
		quiz.gameId = gameId;
		quiz.teams = [];

		var questions = [];
		
		//izvuci svaki zadatak iz baze
		for (var questionId of quiz.questions) {
			dbapi.getQuestionById(questionId).then(function(question) {
				questions.push(question);

				/**
				*	ako si izvukao sve zadatke (zadnja iteracija),
				*	umjesto liste id-eva u quiz.questions stavi
				*	stvarnu listu zadataka.
				*/
				if(questions.length == quiz.questions.length) {
					quiz.questions = questions;
					dbapi.activateQuiz(quiz);
				}
			});
		}

		res.send({
			"gameId": gameId
		});
	});

});

module.exports = router;