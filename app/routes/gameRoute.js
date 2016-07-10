//gameRoute.js

var express = require('express');
var dbapi = require('../dbapi').api();

var router = express.Router();

var socket;

router.use(function(req, res, next) {
	var gameId = req.query.gameId || req.headers['gameid'];
	if(gameId) {
		var verified = dbapi.verifyGameId(gameId);
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



router.post('/saveteam', function(req, res) {
	var team = req.body;
	var gameId = req.query.gameId || req.headers['gameid'];

	team.answers = [];

	dbapi.insertTeam(team, gameId, function(teamId) {
		res.send({
			'teamId': teamId
		});
	});
});

module.exports = router;