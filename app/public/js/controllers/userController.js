//userController.js

function userController($scope, $state, $window, authService, usersData, data) {

	$scope.user = authService.getUser($window.localStorage.token);

	$scope.questionsList = data.questions;

	$scope.onClickLogOut = function () {
		authService.logOut(function() {
			$state.go('main.index');
		});
	};

	$scope.onClickGetQuestions = function() {
		//$state.go('user.questions.newquestion');
		
		usersData.getQuestions().$promise.then(
    		function(response) {
    			$scope.questionsList = response.questions;
      		}, function(response){
      			console.log(response);
    		});
	};
};	