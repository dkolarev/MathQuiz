//gameRoute.js

var express = require('express');
var dbapi = require('../dbapi').api();

var router = express.Router();

var socket;

router.use(function(req, res, next) {
	console.log("DAV dasdas");
	var gameId = req.query.gameId;
	console.log(req.body.gameId);
	if(gameId) {
		var quiz = dbapi.verifyGameId(gameId);

		if(quiz) {
			next();
		} else {
			res.send({
				'success': false,
				'status': 'gameId not valid'
			});
		}

	} else {
		res.send({
			'success': false,
			'status': 'gameId required'
		});
	}
});

router.get('/createteam', function(req, res) {

});

module.exports = router;