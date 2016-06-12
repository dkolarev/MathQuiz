//apiRoute.js

var express = require('express');
var router = express.Router();
var dbapi = require('./dbapi').api();

/**
*	Provjera jedinstvenosti korisnickog imena
*	pri prijavi. Ako je korisnicko ime vec
*	zauzeto klijentu se salje 'collision' zastavica,
*	a u suprotnom vraca 'unique' kao znak da je
*	korisnicko ime slobodno.
*/
router.get('/:username', function(req, res) {
	var username = req.params.username;
	var status = dbapi.checkUsernameAvailability(username).then(function(count) {
		if(count > 0) 
			var response = 'collision';
		else
			var response = 'unique'; 

		res.setHeader('Content-Type', 'application/json');
		res.send({unique: response});
	});
});

module.exports = router;
