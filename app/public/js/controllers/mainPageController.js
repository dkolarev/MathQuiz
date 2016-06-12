//mainPageController.js

function mainPageController($scope, $location, usersData) {

	$scope.onClickSignIn = function() {
		$location.url('main/signin');
	};

	$scope.onClickCancel = function() {
		$location.url('main/index');
	};

	$scope.onClickSubmitRegistration = function(user, signInForm) {
		if(signInForm.$valid){
			usersData.signIn(user).$promise.then(
				function(response) {
					console.log("Succesfully sign in as + " + user.username);
				}, function(response) {
					console.log(response);
				}
			);
		}
	};

	
};