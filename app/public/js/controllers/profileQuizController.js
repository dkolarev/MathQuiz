//profileQuizController.js

function profileQuizController($scope, $state, $uibModal, $location, usersData) {

	$scope.profileQuizQuestions = [];

	var getQuestions = function(quiz) {
		for(var questionId of quiz.questions) {
			for(var question of $scope.questionsList) {
				if(questionId == question._id) {
					$scope.profileQuizQuestions.push(question);
				}
			}
		}
	};

	if($state.params.quizId) {
  		(function() {
			for(var quiz of $scope.quizzesList) {
				if($state.params.quizId == quiz._id) {
					$scope.profileQuiz = quiz;
					getQuestions(quiz);
				}
			}
		})();
  	}


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

	$scope.onClickEdit = function(quizId) {
		$location.url('/user/quizzes/newquiz/' + quizId);
	};

	$scope.onClickDelete = function(quizId) {
		usersData.deleteQuiz(quizId);
		$state.go('user.quizzes');
	};

	$scope.onClickStartQuiz = function(quizId) {
		usersData.startQuiz(quizId).$promise.then(function(response) {
			$scope.gameId = response.gameId;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickPlay = function(gameId) {
		usersData.playQuiz(gameId).$promise.then(function(response) {
			console.log(response);	
		}, function(response) {
			console.log(response);
		});
	};
};