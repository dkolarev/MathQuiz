//hashingService.js

var crypto = require('crypto');

/**
*	Generira nasumican string proizvoljne duljine
*/
var generateRandomString = function(length) {
	return crypto.randomBytes(Math.ceil(length/2))
			.toString('hex')
			.slice(0, length);
};

/**
*	Hashira lozinku sa sha512 algoritmom.
*/
var sha512 = function(password, salt) {
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	var value = hash.digest('hex');

	return {
		salt: salt,
		passwordHash: value
	}
}

module.exports = {
	generateRandomString: generateRandomString,
	sha512: sha512
};