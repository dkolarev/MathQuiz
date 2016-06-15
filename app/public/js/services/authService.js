//authService.js

function authService($window, $resource) {

	var signIn = function(user) {
		return $resource('/auth/signin').save(user);
	};

	var logIn = function(user) {
		return $resource('/auth/login').save(user);
	};

	var logOut = function(callb) {
		delete $window.localStorage.token;
		
		callb();
	};


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
           return window.atob(output);
	};

	/**
	*	Dohvaca podatke iz tokena.
	*/
	var getTokenClaim = function(token) {
		var user;
		if(typeof token != 'undefined') {
			var encoded = token.split('.')[1];
			user = JSON.parse(urlBase64Decode(encoded));
		}
		return user;
	};

	/**
	*	Provjerava je li token valjan. 
	*/
	var verifyToken = function() {
		return $resource('/api').get();
	};

	var saveToken = function(token, callb) {
		$window.localStorage.token = token;

		callb();
	};

	var getUser = function() {
		return getTokenClaim($window.localStorage.token);
	};

	return {
		signIn: signIn,
		logIn: logIn,
		logOut: logOut,
		saveToken: saveToken,
		verifyToken: verifyToken,
		getUser: getUser
	};

};