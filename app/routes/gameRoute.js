//gameRoute.js

/**
*	Rute kojima pristupaju igraci tijekom igre.
*/

var express = require('express');
var activeGamesCollection = require('../activeGamesCollection');
var gameControl = require('../gameControl');

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
*	Igrac salje svoj team sa podacima (ime, clanovi)
*	i registrira se za igru.
*/
router.post('/saveteam', function(req, res) {
	var team = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];

	team.answers = [];	//odgovori tima za svaki zadatak
	team.pointsSum = 0; //ukupni bodovi koje je tim dobio

	//ubaci tim u listu timova za kviz s tim gameId
	activeGamesCollection.insertTeam(team, gameId, function(teamId) {
		res.send({
			'teamId': teamId
		});
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

router.post('/sendrating', function(req, res) {
	var data = req.body;

	res.end();
});

module.exports = router;