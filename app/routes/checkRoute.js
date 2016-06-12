//checkRoute.js

var express = require('express');
var router = express.Router();
var dbapi = require('../dbapi').api();

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
	var status = dbapi.checkUsernameAvailability(username).then(function(count) {
		if(count > 0) 
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
	var status = dbapi.checkEmailAvailability(email).then(function(count) {
		if(count > 0)
			response = 'collision';
		else
			response = 'unique';

		res.setHeader('Content-Type', 'application/json');
		res.send({unique: response});
	})
});

/**
*	Ruta kojoj se pristupa pri uspjesnom
*	popunjavanju 'signIn' forme. Poziva
*	se funkcija za dodavanje novog korisnika
*	u bazu.
*/
router.post('/signin', function(req, res) {
	var user = req.body;
	dbapi.insertUser(user);
	res.end();
});

module.exports = router;
