//userRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var userDataRepository = require('../data/dbapi').userDataRepository;
var activeGamesCollection = require('../data/activeGamesCollection');
var gameMapper = require('../mappers/gameMapper');

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


router.get('/game', function(req, res) {
	var activeGames = activeGamesCollection.getAllGames();

	var dashboard = gameMapper.gameListToDashboard(activeGames);

	res.setHeader('Content-Type', 'application/json');
	res.send({
		"dashboard": dashboard
	});
});

router.get('/:username', function(req, res) {
	var username = req.params.username;
	userDataRepository.getUserByUsername(username).then(function(user) {
		res.setHeader('Content-Type', 'application/json');
		res.send({
			"user": {
				"_id": user.id,
				"username": user.username,
				"email": user.email,
				"joined": user.joined
			}
		});
	});
});


module.exports = router;