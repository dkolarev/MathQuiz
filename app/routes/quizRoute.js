//quizRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var Quiz = require('../data/quiz/Quiz');
var quizDataRepository = require('../data/quiz/quizDataRepository').dataRepository;
var questionDataRepository = require('../data/question/questionDataRepository').dataRepository;
var quizDataValidator = require('../data/quiz/quizDataValidator');
var crypto = require('crypto');
var activeGamesCollection = require('../data/activeGamesCollection');
var gameControl = require('../gameControl');
var paginationFilter = require('../filters/paginationFilter');

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
*	Salje klijentu listu svih kvizova u bazi.
*/
router.get('/all', function(req, res) {
	quizDataRepository.queryQuizzes().toArray().then(function (quizzes) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"quizzesList": quizzes
		});
	});
});

router.get('/list/:itemsPerPage/:pageNumber', function(req, res) {
	var itemsPerPage = parseInt(req.params.itemsPerPage);
	var pageNumber = parseInt(req.params.pageNumber);

	quizDataRepository.getQuizListMetadata()
		.toArray(function(err, quizzes) {
			var totalItems = quizzes.length;
			var quizzesList = quizzes.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
			res.setHeader('Content-Type', 'application/json');
			res.send({
				"quizzesList": quizzesList,
				"totalItems": totalItems
			});
		});
});

router.post('/list/filter', function(req, res) {
	var itemsPerPage = req.body.pageItems;
	var pageNumber = req.body.currentPage;

	var filter = {
		fieldFilter: req.body.fieldFilter,
		ratingFilter: req.body.ratingFilter,
		sortFilter: req.body.sortFilter,
		sortOrder: req.body.sortOrder
	};

	var sort = {};
	Object.defineProperty(sort, filter.sortFilter, {
		value: filter.sortOrder,
		writable: true,
		enumerable: true,
		configurable: true
	});

	if (filter.fieldFilter.length === 0 && filter.ratingFilter.length === 0) {
		quizDataRepository.getQuizListMetadata()
			.sort(sort)
			toArray(function(err, quizzes) {
				var totalItems = quizzes.length;
				var quizzesList = paginationFilter(quizzes, itemsPerPage, pageNumber);
				res.setHeader('Content-Type', 'application/json');
				res.send({
					"quizzesList": quizzesList,
					"totalItems": totalItems
				});
			});
	} else if (filter.fieldFilter.length === 0 || filter.ratingFilter.length === 0) {
		quizDataRepository.getQuizListMetadata()
			.filter({$or: [ {"field": {$in: filter.fielFilter}},
					{"difficulty": {$in: filter.difficultyFilter}}]})
			.sort(sort)
			.toArray(function(err, quizzes) {
				var totalItems = quizzes.length;
				var quizzesList = paginationFilter(quizzes, itemsPerPage, pageNumber)
				res.setHeader('Content-Type', 'application/json')
				res.send({
					"quizzesList": quizzesList,
					"totalItems": totalItems
				});
			})
	} else {
		quizDataRepository.getQuizListMetadata()
			.filter({$or: [{"field": {$in: filter.fieldFilter}},
					{"difficulty": {$in: filter.difficultyFilter}}]})
			.sort(sort)
			.toArray(function(err, quizzes) {
				var totalItems = quizzes.length;
				var quizzesList = paginationFilter(quizzes, itemsPerPage, pageNumber);
				res.setHeader('Content-Type', 'application/json')
				res.send({
					"quizzesList": quizzesList,
					"totalItems": totalItems
				});
			});
	}
});	

/**
*	Salje klijentu kviz na temelju id-a.
*/
router.get('/:quizId', function(req, res) {
	var quizId = req.params.quizId;
	quizDataRepository.getQuiz(quizId).then(function(quiz) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"quiz": quiz
		});
	});
});

router.get('/details/:quizId', function(req, res) {
	var quizId = req.params.quizId;
	var questions = [];
	quizDataRepository.getQuiz(quizId).then(function(quiz) {
		//izvuci svaki zadatak iz baze
		questionDataRepository.questionListByIds(quiz.questions).toArray(function(err, doc) {
			quiz.questions = doc;

			res.setHeader('Content-Type', 'application/json');
			res.send({
				"quiz": quiz
			});
		});
	});
});	

/**
*	Ruta za spremanje kviza. Ako kviz sadrzi id
*	znaci da se radio o update kviza jer kviz ima id
*	tek kad dospije u bazu. U suprotnom sprema se novi
*	kviz.
*/
router.post('/save', function(req, res) {
	var quiz = req.body;
	var socketio = req.app.get('socketio');
	var currentTime = new Date().toISOString();

	var quizModel = new Quiz(quiz);

	if(quizModel._id) {
		var valid = quizDataValidator.validateQuiz(quizModel);

		if(valid) {
			quizModel.changeModifiedTime(currentTime);

			quizDataRepository.updateQuiz(quizModel, function(err, doc) {
				socketio.emit('updateQuiz', doc);

				res.send({
					success: true
				});
			});
		} else {
			res.send({
				success: false
			});
		}
	
	} else {
		var valid = quizDataValidator.validateQuiz(quizModel);

		if(valid) {
			quizModel.changeCreatedTime(currentTime);
			quizModel.changeModifiedTime(currentTime);

			quizDataRepository.insertQuiz(quizModel).then(function(doc) {
				socketio.emit('newQuiz', doc.ops[0]);

				res.send({
					success: true
				});
			});
		} else {
			res.send({
				success: false
			});
		}
	}
});

/**
*	Ruta za brisanje kviza. Korisnik salje id kviza
*	koji zeli obrisati.
*/
router.get('/delete/:quizId', function(req, res) {
	var quizId = req.params.quizId;
	var socketio = req.app.get('socketio');
	if(quizId) {
		quizDataRepository.deleteQuiz(quizId);

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
router.get('/start/:quizId/:user', function(req, res) {
	var quizId = req.params.quizId;
	var user = req.params.user;
	quizDataRepository.getQuiz(quizId).then(function(quiz) {
		/**
		*	Kreiraj jedinstveni nasumicni id aktivnog kviza
		*	koji se ponasa kao token za pristup igraca.
		*/
		var gameId = crypto.randomBytes(4).toString('hex');
		quiz.gameId = gameId;

		//kreiraj namespace socket za tu igru
		var socketio = req.app.get('socketio');
		var socketNamespace = '/' + gameId;
		var gameSocket = socketio.of(socketNamespace);
		quiz.gameSocket = gameSocket;
		
		//timovi koji se natjecu u kvizu
		quiz.teams = [];
		//postavi indeks aktivnog pitanja na prvo pitanje
		quiz.currentQuestionPointer = 0;
		quiz.answersRecieved = 0;
		quiz.gameStatus = 'waiting';
		quiz.started = new Date().toISOString();
		quiz.startedBy = user;
		
		var questions = [];	//pitanja
		
		questionDataRepository.questionListByIds(quiz.questions).toArray(function(err, doc) {
			quiz.questions = doc;

			activeGamesCollection.activateQuiz(quiz);

			res.send({
				"gameId": gameId
			});
		});	
	});
});

router.get('/play/:gameId', function(req, res) {
	var gameId = req.params.gameId;
	var socketio = req.app.get('socketio');
	
	gameControl.play(gameId, socketio);

	var quiz = activeGamesCollection.getQuiz(gameId);
	quizDataRepository.updateQuizPlayedCounter(quiz._id);

	res.end();
});

module.exports = router;