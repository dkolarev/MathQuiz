//userController.js

function userController($scope, $state, authService) {

	//stavi korisnicko ime trenutnog korisnika na scope
	$scope.user = authService.getUser();

	$scope.onClickLogOut = function () {
		authService.logOut(function() {
			$state.go('main.index');
		});
	};
};	