//mainPageController.js

function mainPageController($scope, $state, $window, authService, gameService) {
	
	/**
	*	Ako je signIn forma valjano popunjena posalji popunjene
	*	informacije na server za unos u bazu. Kao odgovor korisnik
	*	prima token kojeg pozivom funkcije saveUserAndToken sprema
	*	za daljnu komunikaciju sa serverom i redirekta korisnika
	*	na /user stranicu.
	*/
	$scope.onClickSubmitRegistration = function(user, signUpForm) {
		if(signUpForm.$valid){
			authService.signUp(user).$promise.then(
				function(response) {
					if (response.success) {
						console.log("Succesfully sign in as + " + user.username);
						authService.saveToken(response.token, function() {
							$state.go('user.home');
						});
					}
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
						authService.saveToken(response.token, function() {
							authService.isLogedIn = true;
							$state.go('user.home');
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

	/*
	*	Nakon sto korisnik koji zeli pristupiti odredenom kvizu
	*	pritisnio tipku enter, poziva se funkcija saveGameId
	*	koja ce spremiti gameId u localStorage i redirektati
	*	korisnika na 'createteam' stanje za unos timova.
	*	Uneseni gameId mora proci validaciju na serveru,
	*	te u slucaju krivog gameId-a zabranjuje se pristup.
	*/
	$scope.onClickEnter = function(gameId) {
		if(gameId) {
			gameService.saveGameId(gameId);
			gameService.verifyGameId().$promise.then(function(response) {
				gameService.saveGameId(gameId);
				$state.go('createteam');
			}, function(response) {
				$scope.enterMessage = "Quiz code is not valid.";
			});
			
		}
	};

	$scope.onClickSpectate = function(gameId) {
		if(gameId) {
			gameService.saveGameId(gameId);
			gameService.verifyGameId().$promise.then(function(response) {
				gameService.saveGameId(gameId);
				$state.go('spectatorpending');
			}, function(response) {
				$scope.spectateMessage = "Quiz code is not valid.";
			});
		}
	}

};