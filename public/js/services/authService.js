//authService.js

function authService($window, $resource) {

	var signUp = function(user) {
		return $resource('/api/auth/signup').save(user);
	};

	var logIn = function(user) {
		return $resource('/api/auth/login').save(user);
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
		if(typeof token !== 'undefined') {
			var encoded = token.split('.')[1];
			user = JSON.parse(urlBase64Decode(encoded));
		}
		return user;
	};

	/**
	*	Provjerava je li token valjan. 
	*/
	var verifyToken = function() {
		return $resource('/api/validate').get();
	};

	var saveToken = function(token, callb) {
		$window.localStorage.token = token;

		callb();
	};

	var getUser = function() {
		return getTokenClaim($window.localStorage.token);
	};

	var isAuthenticated = function() {
		var user = getUser();
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	return {
		signUp: signUp,
		logIn: logIn,
		logOut: logOut,
		saveToken: saveToken,
		verifyToken: verifyToken,
		getUser: getUser,
		isAuthenticated: isAuthenticated
	};
};