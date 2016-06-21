//apiRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
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


router.get('/getdata', function (req, res) {
	dbapi.queryQuestions().then(function (questions) {
		dbapi.queryQuizzes().then(function(quizzes) {
			console.log("DAV", quizzes);
			res.setHeader('Content-Type', 'application/json');
			res.send({
				"questionsList": questions,
				"quizzesList": quizzes
			});
		});
	});
});



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
		
		dbapi.insertQuestion(question);
		
		socketio.emit('newQuestion', question);
	}

	res.end();
});

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

router.post('/savequiz', function(req, res) {
	var quiz = req.body;
	var socketio = req.app.get('socketio');
	var currentTime = new Date().toISOString();

	quiz.created = currentTime;
	quiz.lastModified = currentTime;

	dbapi.insertQuiz(quiz);

	socketio.emit('newQuiz', quiz);

	res.end();
});


module.exports = router;