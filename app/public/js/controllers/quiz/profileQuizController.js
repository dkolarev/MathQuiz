//profileQuizController.js

function profileQuizController($scope, $state, $location, data, modalService, quizData, authService) {

	$scope.profileQuiz = data.quiz;
	$scope.profileQuizQuestions = data.quiz.questions;

	$scope.currentPage = 1;
	$scope.pageItems = 6;

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
		$state.go('user.quizlist');
	};

	$scope.onClickEdit = function(quiz) {
		var user = authService.getUser();
		if (user.username === quiz.createdBy) {
			$location.url('/user/quiz/newquiz/' + quiz._id);
		}
	};

	$scope.onClickDelete = function(quiz) {
		var user = authService.getUser();
		if (user.username === quiz.createdBy) {
			var modalInstance = modalService.deleteQuizModal(quiz);
		}
	};

	$scope.onClickStartQuiz = function(quizId) {
		var user = authService.getUser();
		quizData.startQuiz(quizId, user.username).$promise.then(function(response) {
			$scope.gameId = response.gameId;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickPlay = function(gameId) {
		quizData.playQuiz(gameId).$promise.then(function(response) {
			console.log(response);	
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance = modalService.questionInfoModal(question._id);
	};
};