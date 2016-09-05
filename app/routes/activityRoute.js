//activityRoute.js

var express = require('express');
var activityDataRepository = require('../data/activity/activityDataRepository').dataRepository;
var userDataRepository = require('../data/user/userDataRepository').dataRepository;
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

var router = express.Router();

/*
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
});*/

router.get('/list', function(req, res) {
	activityDataRepository.queryAllActivity().toArray(function(err, documents) {
		if(err) {
			console.log("DAV");
			return;
		}


	});
});