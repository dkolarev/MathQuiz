//authService.js

function authService($window, $resource) {

	var currentUser;


	var signIn = function(user) {
		return $resource('/auth/signin').save(user);
	};

	var logIn = function(user) {
		return $resource('/auth/login').save(user);
	};

	var logOut = function(callb) {
		currentUser = {};
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
	var checkToken = function() {
		return $resource('/api').get();
	};

	var saveUserAndToken = function(token, callb) {
		currentUser = getTokenClaim(token);
		$window.localStorage.token = token;

		callb();
	};


	return {
		signIn: signIn,
		logIn: logIn,
		logOut: logOut,
		currentUser: currentUser,
		saveUserAndToken: saveUserAndToken,
		checkToken: checkToken,
		currentUser: currentUser
	};

};