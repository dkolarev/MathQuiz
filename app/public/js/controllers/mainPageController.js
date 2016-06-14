//mainPageController.js

function mainPageController($scope, $state, authService, $window) {


	$scope.onClickSignIn = function() {
		$state.go('main.signin');
	};

	$scope.onClickCancel = function() {
		$state.go('main.index');
	};

	/**
	*	Ako je signIn forma valjano popunjena posalji popunjene
	*	informacije na server za unos u bazu. Kao odgovor korisnik
	*	prima token kojeg pozivom funkcije saveUserAndToken sprema
	*	za daljnu komunikaciju sa serverom i redirekta korisnika
	*	na /user stranicu.
	*/
	$scope.onClickSubmitRegistration = function(user, signInForm) {
		if(signInForm.$valid){
			authService.signIn(user).$promise.then(
				function(response) {
					console.log("Succesfully sign in as + " + user.username);
					authService.saveUserAndToken(response.token, function() {
						$state.go('user');
					});
				}, function(response) {
					console.log(response);
				}
			);
		}
	};

	/*
	*	Ako je logIn forma valjano popunjena od servera korisnika
	*	dobije token za daljnu komunikaciju. Token se pozivom na 
	*	funkciju saveUserAndToken sprema i korisnik se redirekta na
	*	/user stranicu. Ako ispunjeni podaci u logIn formi nisu valjani
	*	korisnik dobiva odgovor o neuspjesnom popunjavanju forme i ispisuje
	*	se greska.
	*/
	$scope.onClickLogIn = function(user, logInForm) {
		if(user.username.length > 0 && user.password.length > 0){
			authService.logIn(user).$promise.then(
				function(response){
					if(response.success){
						authService.saveUserAndToken(response.token, function() {
							$state.go('user');
						});
					} else {
						logInForm.$setValidity('wrongUorP', false);
						$scope.message = response.message;
					}
				}, function(response) {
					console.log(response);
			});
		};
	};

	$scope.onClickTest = function() {
		authService.checkToken().$promise.then(
			function (response) {
				console.log(response);
			}, function (response) {
				console.log(response);
			})
	}

	
};