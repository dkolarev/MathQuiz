//validateRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

var router = express.Router();

router.get('/', function (req, res, next) {
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

module.exports = router;