//gameRoute.js

/**
*	Rute kojima pristupaju igraci tijekom igre.
*/

var express = require('express');
var activeGamesCollection = require('../data/game/activeGamesCollection');
var teamDataValidator = require('../data/game/teamDataValidator');
var gameControl = require('../scripts/gameControl');
var gameMapper = require('../mappers/gameMapper');
var gameSocketService = require('../scripts/gameSocketService');
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
		if (quiz) {
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
					"success": false,
					"message": "Cannot register team for started game."
				});
			}
		} else {
			res.send({
				"success": false,
				"message": "Game not exist."
			});
		}
	} else {
		res.send({
			"success": false,
			"message": "Invalid team. Team name and at least one player required."
		});
	}
});

/**
*	Ruta za slanje podataka o aktivnoj igri.
*/
router.get('/quiz', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];
	var teamId = req.query.teamId || req.headers['teamid'];

	var quiz = activeGamesCollection.getQuiz(gameId);
	question = quiz.questions[quiz.currentQuestionPointer];

	var playerQuestion = gameMapper.questionToPlayerQuestion(question);
	var scoreboard = gameMapper.teamListToScoreboardData(quiz.teams);

	if(teamId) {
		var teamAnswer = activeGamesCollection.getTeamAnswer(gameId, teamId, question._id);

		if (teamAnswer) {
			res.send({
				"question": playerQuestion,
				"scoreboard": scoreboard,
				"answered": true,
				"success": teamAnswer.success,
				"answer": teamAnswer.answer
			});
		} else {
			res.send({
				question: playerQuestion,
				scoreboard: scoreboard,
				"answered": false
			});
		}
	} else {
		res.send({
			question: playerQuestion,
			scoreboard: scoreboard
		});
	}
});

/**
*	Ruta za odredenu igru salje popis timovi koji su
*	prijavljeni status o igri i tko ga je pokrenio.
*/
router.get('/teams', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];
	var teamId = req.query.teamId || req.headers['teamid'];

	var quiz = activeGamesCollection.getQuiz(gameId);

	if (quiz) {
		var metadataList = gameMapper.teamListToTeamMetadataList(quiz.teams);

		res.send({
			"teams": metadataList,
			"status": quiz.gameStatus,
			"startedBy": quiz.startedBy
		});
	} else {
		res.end();
	}
	
});

router.get('/status', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];
	var teamId = req.query.teamId || req.headers['teamid'];

	var quiz = activeGamesCollection.getQuiz(gameId);

	if (quiz) {
		var team = activeGamesCollection.getTeamById(gameId, teamId);
		if (!team && quiz.gameStatus !== gameStatusEnum.pendingStatus) {
			res.status(403).json({
				"success": false,
				"status": quiz.gameStatus
			});	
		} else if(!team && quiz.gameStatus === gameStatusEnum.pendingStatus){
			res.send({
				"success": true,
				"status": quiz.gameStatus
			});
		} else {
			res.send({
				"success": true,
				"status": quiz.gameStatus,
				"team": {
					"name": team.name,
					"players": team.players
				}
			});
		}
	} else {
		res.send({
			"success": false,
			"status": "No quiz available."
		});
	}
});

/**
*	Ruta za primanje odgovora od timova.
*/
router.post('/sendanswer', function(req, res) {
	var data = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];
	var teamId = req.query.teamId || req.headers['teamid'];

	/**
	*	Provjeri je li tim vec odgovorio na pitanje. Ako je
	*	ne dozvoli mu da ponovno spremi odgovor.
	*/
	var teamAnswer = activeGamesCollection.getTeamAnswer(gameId, teamId, data.questionId);

	if(teamAnswer) {
		res.send({
			correct: teamAnswer.success
		});
	} else {
		var correct = gameControl.validateAnswer(data.answer, gameId, data.questionId, data.teamId, data.answerTime);

		res.send({
			correct: correct
		});

		gameControl.iterateAnsweredCounter(gameId);
	}
});

/**
*	Ruta za spremanje ratinga kviza od igraca.
*/
router.post('/rating', function(req, res) {
	var data = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];

	gameControl.rateQuiz(gameId, data.rating);
	
	res.end();
});

/**
*	Ruta za dohvacanje podataka o pobjedniku.
*/
router.get('/winnerdata', function(req, res) {
	var gameId = req.query.gameId || req.headers['gameid'];

	var data = gameControl.getWinnerData(gameId);
	if (data.winner.teamPoints > 0) {
		res.send({
			"scoreboard": data.scoreboard,
			"winner": data.winner
		});
	} else {
		res.send({
			"scoreboard": data.scoreboard,
			"winner": null
		});
	}
});

module.exports = router;