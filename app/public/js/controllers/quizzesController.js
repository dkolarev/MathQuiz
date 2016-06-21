//quizzesController.js

function quizzesController($scope, $uibModal, $state, usersData) {
	$scope.newQuiz = {};

	$scope.onClickSave = function(quiz) {
		if(quiz.questions.length > 0 && $scope.newQuizForm.$valid) {
			if(!quiz.created)
				quiz.created = $scope.user.username;
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