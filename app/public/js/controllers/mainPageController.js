//mainPageController.js

function mainPageController($scope, $location, usersData) {

	$scope.onClickSignIn = function() {
		$location.url('/main/signin');
	};

	$scope.onClickCancel = function() {
		$location.url('/main/index');
	};

	$scope.onClickSubmitRegistration = function(user, signInForm) {
		if(signInForm.$valid){
			usersData.signIn(user).$promise.then(
				function(response) {
					console.log("Succesfully sign in as + " + user.username);
					$location.url('/user');
				}, function(response) {
					console.log(response);
				}
			);
		}
	};

	$scope.onClickLogIn = function(user) {
		if(user.username.length > 0 && user.password.length > 0){
			usersData.logIn(user).$promise.then(
				function(response){
					if(response.success){
						$location.url('/user');
					} else {
						$scope.logInForm.$setValidity('wrongUorP', false);
						$scope.message = response.message;
					}
				}, function(response) {
					console.log(response);
			});
		};
	};

	
};