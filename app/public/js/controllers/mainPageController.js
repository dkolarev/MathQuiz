//mainPageController.js

function mainPageController($scope, $location) {

	$scope.onClickSignIn = function() {
		$location.url('main/signin');
	};

	$scope.onClickCancel = function() {
		$location.url('main/index');
	};

	
};