//apiRoute.js

var express = require('express');
var jwt = require('jsonwebtoken');
var dbapi = require('../dbapi').api();

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

/*
router.get('/questions', function(req, res) {
	dbapi.queryQuestions().then(function (documents) {
		res.setHeader('Content-Type', 'application/json');
		res.send({"questions": documents});
	});
});
*/

router.get('/getdata', function (req, res) {
	dbapi.queryQuestions().then(function (documents) {
		res.setHeader('Content-Type', 'application/json');
		res.send({"questionsList": documents});
	});
});

router.post('/savequestion', function(req, res) {
	var question = req.body;

	if(question._id) {
		dbapi.updateQuestion(question);
	} else {
		dbapi.insertQuestion(question);
	}

	res.end();
});


module.exports = router;