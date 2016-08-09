//profileQuizController.js

function profileQuizController($scope, $state, $location, data, modalService, quizDataRepository) {

	$scope.profileQuiz = data.quiz;
	$scope.profileQuizQuestions = data.quiz.questions;

	$scope.rating = 0;

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

	$scope.onClickBack = function() {
		$state.go('user.quizzes');
	};

	$scope.onClickEdit = function(quizId) {
		$location.url('/user/quiz/editquiz/' + quizId);
	};

	$scope.onClickDelete = function(quizId) {
		usersData.deleteQuiz(quizId);
		$state.go('user.quizzes');
	};

	$scope.onClickStartQuiz = function(quizId) {
		quizDataRepository.startQuiz(quizId).$promise.then(function(response) {
			$scope.gameId = response.gameId;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickPlay = function(gameId) {
		quizDataRepository.playQuiz(gameId).$promise.then(function(response) {
			console.log(response);	
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance = modalService.questionInfoModal(question);
	};
};