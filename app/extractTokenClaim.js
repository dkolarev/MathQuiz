//extractTokenClaim.js

var atob = require('atob');

var urlBase64Decode = function(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
           	break;
        case 2:
      		output += '==';
            break;
        case 3:
        	output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return atob(output);
};

/**
*	Dohvaca podatke iz tokena.
*/
module.exports = function(token) {
	var user;
	if(typeof token !== 'undefined') {
		var encoded = token.split('.')[1];
		user = JSON.parse(urlBase64Decode(encoded));
	}
	return user;
};