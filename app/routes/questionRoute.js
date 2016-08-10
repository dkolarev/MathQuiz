//questionRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var questionDataRepository = require('../data/questionDataRepository');

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

router.get('/all', function(req, res) {
	questionDataRepository.queryQuestions().then(function (questions) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"questionsList": questions
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
router.post('/save', function(req, res) {
	var question = req.body;
	var socketio = req.app.get('socketio');
	var currentTime = new Date().toISOString();

	//ako pitanje ima atribut id onda radi update
	if(question._id) {
		question.lastModified = currentTime;
		
		questionDataRepository.updateQuestion(question);

		socketio.emit('updateQuestion', question);
	} else {
		question.created = currentTime;
		question.lastModified = currentTime;
		
		questionDataRepository.insertQuestion(question).then(function(doc) {
			socketio.emit('newQuestion', doc.ops[0]);
		});
	}

	res.end();
});

/**
*	Posalji pitanje klijentu s obzirom na id pitanja.
*/
router.get('/:questionId', function(req, res) {
	var questionId = req.params.questionId;
	questionDataRepository.getQuestionById(questionId).then(function(question) {		
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"question": question
		});
	});
});


/**
*	Ruta za brisanje pitanja u bazi.
*/
router.get('/delete/:questionId', function(req, res) {
	var questionId = req.params.questionId;
	var socketio = req.app.get('socketio');
	if(questionId) {
		questionDataRepository.deleteQuestion(questionId);
		socketio.emit('deleteQuestion', {
			"questionId": questionId
		});
	}
	res.end();
});