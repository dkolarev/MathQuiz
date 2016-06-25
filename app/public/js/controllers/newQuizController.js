//newQuizController.js

function newQuizController ($scope, $state, $uibModal, usersData) {

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
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'QuestionInfoModal.html',
			size: 'lg',
			resolve: {
				question: function() {
					return question;
				}
			},
			controller: 'questionInfoModalController'
		});
	};

};