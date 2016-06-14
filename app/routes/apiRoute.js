//apiRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();


var secret = '1234';

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


router.get('/checkToken', function(req, res) {
	var token = req.query.token || req.headers['x-auth-token'];
	if (token) {
		jwt.verify(token, secret, function(err, decode) {
			if (err) {
				return res.status(401).json({
					success: false,
					message: 'Wrong token'
				});
			} else {
				return res.status(200).json({
					success: true,
					message: 'Valid token'
				});
			} 
		})
	} else {
		return res.json({
			success: false,
			message: 'No token given'
		});
	}
});

module.exports = router;