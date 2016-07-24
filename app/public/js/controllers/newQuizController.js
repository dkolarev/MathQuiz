//newQuizController.js

function newQuizController ($scope, $state, modalService, usersData) {

	$scope.newQuiz = {};

	
  	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

  	if ($state.params.quizId)
  		(function() {
  			for (var quiz of $scope.quizzesList) {
  				if($state.params.quizId == quiz._id)
  					$scope.newQuiz = quiz;
  			}
  		})();

  	$scope.onClickSave = function(quiz) {
		if(quiz.questions.length > 0 && $scope.newQuizForm.$valid) {
			if(!quiz.createdBy)
				quiz.createdBy = $scope.user.username;
			usersData.saveQuiz(quiz).$promise.then(function(response) {
				$state.go('user.quizzes');
			}, function(response) {
				console.log(response);
			});
		}
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance =	modalService.questionInfoModal(question);
	};

};