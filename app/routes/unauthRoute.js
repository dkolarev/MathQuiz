//unauthRoute.js

var express = require('express');
var dbapi = require('../dbapi').api();
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
	dbapi.getUserByUsername(username).then(function(doc) {
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
	dbapi.getUserByEmail(email).count().then(function(count) {
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
	var cryptedPassword = crypt.generateHash(user.password); //hashiraj lozinku
	dbapi.insertUser(user, cryptedPassword);

	var userInformations = {
		"username": user.username,
		"email": user.email
	};

	var token = jwt.sign(userInformations, secret, {
		expiresIn: '1m'
	});

	res.status(200).json({
		success: true,
		token: token
	});
});



/**
*	Ruta za autentifikaciju korisnika. U bazi se provjerava
*	postojanje korisnika.
*/
router.post('/login', function(req, res) {
	var user = req.body;
	res.setHeader('Content-Type', 'application/json');
	dbapi.getUserByUsername(user.username).then(function(doc) {
		if(!doc) {
			res.send({"success": false, "message": "User not found"});
		} else {
			if(crypt.validPassword(user.password, doc.password)) {
				var userInformations = {
					"username": user.username,
					"email": user.email,
				}
				var token = jwt.sign(userInformations, secret, {
					expiresIn: '1m'
				});

				res.send({
					"success": true, 
					"message": "Successful authentication",
					"token": token
				});
			}
			else
				res.send({"success": false, "message": "Wrong password"});
		}
	});
});


module.exports = router;
