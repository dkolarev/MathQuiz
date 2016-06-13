//mainPageController.js

function mainPageController($scope, $state, usersData) {


	$scope.onClickSignIn = function() {
		$state.go('main.signin');
	};

	$scope.onClickCancel = function() {
		$state.go('main.index');
	};

	$scope.onClickSubmitRegistration = function(user, signInForm) {
		if(signInForm.$valid){
			usersData.signIn(user).$promise.then(
				function(response) {
					console.log("Succesfully sign in as + " + user.username);
					$state.go('user');
				}, function(response) {
					console.log(response);
				}
			);
		}
	};

	$scope.onClickLogIn = function(user, logInForm) {
		if(user.username.length > 0 && user.password.length > 0){
			usersData.logIn(user).$promise.then(
				function(response){
					if(response.success){
						$state.go('user');
					} else {
						logInForm.$setValidity('wrongUorP', false);
						$scope.message = response.message;
					}
				}, function(response) {
					console.log(response);
			});
		};
	};

	
};