//gameRoute.js

/**
*	Rute kojima pristupaju igraci tijekom igre.
*/

var express = require('express');
var activeGamesCollection = require('../data/game/activeGamesCollection');
var teamDataValidator = require('../data/game/teamDataValidator');
var gameControl = require('../gameControl');
var gameMapper = require('../mappers/gameMapper');
var gameSocketService = require('../gameSocketService');
var gameStatusEnum = require('../data/game/gameStatusEnum');


var router = express.Router();

var socket;

/**
*	Pri svakom pristupu provjeri jel igrac ima valjani
*	gameId za aktivnu igru. Ako nema, posalji mu 403
*	'forbidden' status.
*/
router.use(function(req, res, next) {
	var gameId = req.query.gameId || req.headers['gameid'];
		
	if(gameId) {
		var verified = activeGamesCollection.verifyGameId(gameId);
		if(verified) {
			next();
		} else {
			res.status(403).json({
				'success': false,
				'status': 'gameId not valid'
			});
		}
	} else {
		res.status(403).json({
			'success': false,
			'status': 'gameId required'
		});
	}
});

/**
*	Igrac salje svoj tim sa podacima (ime, clanovi)
*	i registrira se za igru.
*/
router.post('/saveteam', function(req, res) {
	var team = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];
	var socketio = req.app.get('socketio');

	var valid = teamDataValidator.validateTeam(team);

	if (valid) {
		team.answers = [];	//odgovori tima za svaki zadatak
		team.pointsSum = 0; //ukupni bodovi koje je tim dobio

		var quiz = activeGamesCollection.getQuiz(gameId);
		if (quiz.gameStatus === gameStatusEnum.pendingStatus) {
			//ubaci tim u listu timova za kviz s tim gameId
			activeGamesCollection.insertTeam(team, gameId, function(teamId) {
				res.send({
					'success': true,
					'teamId': teamId
				});

				team.teamId = teamId;
				
				var gameSocket = activeGamesCollection.getGameSocket(gameId);
				gameSocketService.emitNewTeam(gameSocket, team);
			});
		} else {
			res.send({
				'success': false,
				'details': 'game in progress'
			});
		}
	} else {
		res.send({
			'success': false
		});
	}
});

router.get('/quiz', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];

	var quiz = activeGamesCollection.getQuiz(gameId);
	question = quiz.questions[quiz.currentQuestionPointer];
	//staviti SEKUNDE
	question.time = question.time;

	var playerQuestion = gameMapper.questionToPlayerQuestion(question);
	var scoreboard = gameMapper.teamListToScoreboardData(quiz.teams);

	res.send({
		question: playerQuestion,
		scoreboard: scoreboard
	});
});

router.get('/teams', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];

	var quiz = activeGamesCollection.getQuiz(gameId);
	var metadataList = gameMapper.teamListToTeamMetadataList(quiz.teams);

	res.send({
		teams: metadataList,
		status: quiz.gameStatus
	});
});

router.post('/sendanswer', function(req, res) {
	var data = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];

	var correct = gameControl.validateAnswer(data.answer, gameId, data.questionId, data.teamId);

	res.send({
		correct: correct
	});

	gameControl.iterateAnsweredCounter(gameId);
});

router.post('/rating', function(req, res) {
	var data = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];

	gameControl.rateQuiz(gameId, data.rating);
	
	res.end();
});

router.get('/winnerdata', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];

	var data = gameControl.getWinnerData(gameId);

	res.send({
		"scoreboard": data.scoreboard,
		"winner": data.winner
	});
});

module.exports = router;