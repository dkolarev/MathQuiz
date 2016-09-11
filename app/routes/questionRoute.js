//questionRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var Question = require('../data/question/Question');
var questionDataRepository = require('../data/question/questionDataRepository').dataRepository;
var quizDataRepository = require('../data/quiz/quizDataRepository').dataRepository;
var questionDataValidator = require('../data/question/questionDataValidator');
var questionFilter = require('../filters/questionFilter');
var paginationFilter = require('../filters/paginationFilter');
var extractTokenClaim = require('../scripts/extractTokenClaim');
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
*	Ruta za spremanje pitanja.
*/
router.post('/save', function(req, res) {
	var question = req.body;
	var currentTime = new Date().toISOString();

	var questionModel = new Question(question);

	//validiraj model, tj. podatke koje je korisnik unio
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
});

/**
*	Ruta za editiranje postojeceg pitanja u bazi. 
*/
router.put('/edit/:questionId', function(req, res) {
	var question = req.body;
	var currentTime = new Date().toISOString();

	var questionModel = new Question(question);

	/**
	*	Izvuci iz korisnikovog tokena informaciju o korisniku
	*	i prije spremanja promjena provjeri je li korisnik koji je
	*	je napravio promjene isti onaj koji je napravio i pitanje.
	*/
	var token = req.query.token || req.headers['x-auth-token'];
	var user = extractTokenClaim(token);
	questionDataRepository.getQuestionById(question._id).then(function(dbQuestion) {
		if(dbQuestion.createdBy === user.username) {
			//validiraj model
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

	//izvuci iz korisnikovog tokena podatke o korisniku
	var token = req.query.token || req.headers['x-auth-token'];
	var user = extractTokenClaim(token);

	/**
	*	Prije brisanja pitanja provjeri je li korisnik koji zahtjeva brisanje
	*	isti onaj koji ga je napravio.
	*/
	questionDataRepository.getQuestionById(questionId).then(function(question) {
		if(question.createdBy === user.username) {
			questionDataRepository.deleteQuestion(questionId).then(function() {
				//obrisi pitanje iz svakog kviza u kojem je navedeno
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