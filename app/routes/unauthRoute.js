//unauthRoute.js

var express = require('express');
var userDataRepository = require('../data/dbapi').userDataRepository;
var userDataValidator = require('../data/userDataValidator');
var crypt = require('../bcryptConfig');
var jwt = require('jsonwebtoken');

var router = express.Router();

var secret = '1234';

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

	var valid = userDataValidator.validateUser(user);

	if (valid) {
		var cryptedPassword = crypt.generateHash(user.password); //hashiraj lozinku
		//spremi korisnika u bazu sa hashiranom lozinkom
		userDataRepository.insertUser(user, cryptedPassword);

		//korisnicke informacije za slanje zajedno sa tokenom
		var userInformations = {
			"username": user.username,
			"email": user.email
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
			res.send({"success": false, "message": "User not found"});
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
				res.send({"success": false, "message": "Wrong password"});
			}
		}
	});
});


module.exports = router;
