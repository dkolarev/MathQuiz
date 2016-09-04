//questionRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var Question = require('../data/question/Question');
var questionDataRepository = require('../data/question/questionDataRepository').dataRepository;
var quizDataRepository = require('../data/quiz/quizDataRepository').dataRepository;
var questionDataValidator = require('../data/question/questionDataValidator');
var questionFilter = require('../filters/questionFilter');
var paginationFilter = require('../filters/paginationFilter');
var extractTokenClaim = require('../extractTokenClaim');
var secret = require('../config/config').secret;

var router = express.Router();

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
*	Posalji listu svih pitanja s punim podacima.
*/ 
router.get('/all', function(req, res) {
	questionDataRepository.queryQuestions().toArray().then(function (questions) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"questionsList": questions
		});
	});
});


/**
*	Posalji listu s osnovnim podacima o pitanjima s opcijom za
*	sortiranje i paginaciju.
*/
router.get('/list/:itemsPerPage/:pageNumber', function(req, res) {
	var itemsPerPage = parseInt(req.params.itemsPerPage);
	var pageNumber = parseInt(req.params.pageNumber);

	questionDataRepository.getQuestionsMetadata()
		.sort({'title': 1})
		.toArray(function(err, questions) {
			var totalItems = questions.length;
			var questionsList = paginationFilter(questions, itemsPerPage, pageNumber);
			res.setHeader('Content-Type', 'application/json');
			res.send({
				"questionsList": questionsList,
				"totalItems": totalItems
			});
		});
});


/**
*	Ruta za filtriranje liste pitanja na osnovu filtra
*	koji je korisnik poslao.
*/
router.post('/list/filter', function(req, res) {
	var itemsPerPage = req.body.pageItems;
	var pageNumber = req.body.currentPage;

	var filterData = {
		difficultyFilter: req.body.difficultyFilter,
		fieldFilter: req.body.fieldFilter,
		sortFilter: req.body.sortFilter,
		sortOrder: req.body.sortOrder
	};

	var sort = {};
	Object.defineProperty(sort, filterData.sortFilter, {
		value: filterData.sortOrder,
		writable: true,
		enumerable: true,
		configurable: true
	});

	//kreiraj filter objekt
	var filter = questionFilter.filter(filterData.fieldFilter, filterData.difficultyFilter);

	questionDataRepository.getQuestionsMetadata()
		.filter(filter)
		.sort(sort)
		.toArray(function(err, questions) {
			var totalItems = questions.length;
			var questionsList = paginationFilter(questions, itemsPerPage, pageNumber);
			res.setHeader('Content-Type', 'application/json');
			res.send({
				"questionsList": questionsList,
				"totalItems": totalItems
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
	var currentTime = new Date().toISOString();

	var questionModel = new Question(question);

	//ako pitanje ima atribut id onda radi update
	if(questionModel._id) {
		var token = req.query.token || req.headers['x-auth-token'];
		var user = extractTokenClaim(token);
		questionDataRepository.getQuestionById(question._id).then(function(dbQuestion) {
			if(dbQuestion.createdBy === user.username) {
				var valid = questionDataValidator.validateQuestion(questionModel);

				if (valid) {
					questionModel.changeModifiedTime(currentTime);
					questionDataRepository.updateQuestion(questionModel, function(err, doc) {				
						res.send({"valid": true});
					});
				} else {
					res.send({"valid": false})
				}
			} else {
				res.end();
			}
		});	
	} else {
		var valid = questionDataValidator.validateQuestion(questionModel);

		if (valid) {		
			questionModel.changeCreatedTime(currentTime);
			questionModel.changeModifiedTime(currentTime);
		
			questionDataRepository.insertQuestion(questionModel).then(function(doc) {
				res.send({"valid": true});
			});
		} else {
			res.send({"valid": false});
		}
	}
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
router.delete('/delete/:questionId', function(req, res) {
	var questionId = req.params.questionId;
	var socketio = req.app.get('socketio');

	var token = req.query.token || req.headers['x-auth-token'];
	var user = extractTokenClaim(token);

	questionDataRepository.getQuestionById(questionId).then(function(question) {
		if(question.createdBy === user.username) {
			questionDataRepository.deleteQuestion(questionId).then(function() {
				quizDataRepository.deleteQuestionCascade(questionId);

				socketio.emit('deleteQuestion', {
				"questionId": questionId
				});

				res.end();
			});
		} else {
			res.end();
		}
	});
});



module.exports = router;