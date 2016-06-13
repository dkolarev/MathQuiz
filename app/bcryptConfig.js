//bcryptConfig.js

var bcrypt = require('bcrypt-nodejs');

/**
*	generira hash vrijednost i maskira pravu lozinku
*	za pohranu u bazu.
*/
module.exports.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};


/**
*	Usporeduje proizvoljnu lozinku s odgovorajucom hash
*	vrijednosti u bazi podataka za danog korisnika.
*	Ako je lozinka valjana, vraca true, inace vraca false.
*/
module.exports.validPassword = function(password, dbPassword) {
	return bcrypt.compareSync(password, dbPassword);
};