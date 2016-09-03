//authRoute.js

var express = require('express');
var User = require('../data/user/User');
var userDataRepository = require('../data/user/userDataRepository').dataRepository;
var userDataValidator = require('../data/user/userDataValidator');
var crypt = require('../bcryptConfig');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;

var router = express.Router();

/**
*	Provjera jedinstvenosti korisnickog imena
*	pri prijavi. Ako je korisnicko ime vec
*	zauzeto klijentu se salje 'collision' zastavica,
*	a u suprotnom vraca 'unique' kao znak da je
*	korisnicko ime slobodno.
*/
router.get('/username/:username', function(req, res) {
	var username = req.params.username;
	var response;
	userDataRepository.getUserByUsername(username).then(function(doc) {
		if(doc) 
			response = 'collision';
		else
			response = 'unique'; 

		res.setHeader('Content-Type', 'application/json');
		res.send({unique: response});
	});
});

/**
*	Provjera jedinstvenosti email adrese
* 	koju je novi korisnik unio u 'signIn' formi.
*	Ako je email vec zauzet klijentu se salje 'collision'
*	zastavica, a u suprotnom vraca 'unique' kao znak da
* 	je email adresa slobodna.
*/
router.get('/email/:email', function(req, res) {
	var email = req.params.email;
	var response;
	userDataRepository.getUserByEmail(email).count().then(function(count) {
		if(count > 0)
			response = 'collision';
		else
			response = 'unique';

		res.setHeader('Content-Type', 'application/json');
		res.send({unique: response});
	});
});


/**
*	Ruta kojoj se pristupa pri uspjesnom
*	popunjavanju 'signIn' forme. Poziva
*	se funkcija za dodavanje novog korisnika
*	u bazu.
*/
router.post('/signin', function(req, res) {
	var user = req.body;
	var currentTime = new Date().toISOString();

	var userModel = new User(user);

	var valid = userDataValidator.validateUser(userModel);

	if (valid) {
		userModel.setJoinedTime(currentTime);
		userModel.password = crypt.generateHash(userModel.password); //hashiraj lozinku
		//spremi korisnika u bazu sa hashiranom lozinkom
		userDataRepository.insertUser(userModel);

		//korisnicke informacije za slanje zajedno sa tokenom
		var userInformations = {
			"username": userModel.username
		};

		//generiraj token
		var token = jwt.sign(userInformations, secret, {
			expiresIn: '60m'
		});

		res.status(200).json({
			success: true,
			token: token
		});
	} else {
		res.status(200).json({
			success: false
		});
	}
});



/**
*	Ruta za autentifikaciju korisnika. U bazi se provjerava
*	postojanje korisnika.
*/
router.post('/login', function(req, res) {
	var user = req.body;
	res.setHeader('Content-Type', 'application/json');
	userDataRepository.getUserByUsername(user.username).then(function(doc) {
		if(!doc) {
			//Ako se uneseno korisnicko ime ne podudara ni s jednim u bazi
			res.send({"success": false, "message": "Wrong username or password"});
		} else {
			if(crypt.validPassword(user.password, doc.password)) {
				/*
				*	Ako se unesena lozinka podudara sa hashiranom
				*	u bazi generiraj korisnicke informacije
				*	za slanje sa tokenom.
				*/
				var userInformations = {
					"username": doc.username,
					"email": doc.email,
				};

				//generiraj token
				var token = jwt.sign(userInformations, secret, {
					expiresIn: '60m'
				});

				res.send({
					"success": true, 
					"message": "Successful authentication",
					"token": token
				});
			}
			else{
				//ako se unesena lozinka ne podudara s hashiranom u bazi
				res.send({"success": false, "message": "Wrong username or password"});
			}
		}
	});
});


module.exports = router;
