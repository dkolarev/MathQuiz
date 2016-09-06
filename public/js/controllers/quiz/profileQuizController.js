//profileQuizController.js

function profileQuizController($scope, $state, $location, data, modalService, quizResource, authService) {

	$scope.profileQuiz = data.quiz;
	$scope.profileQuizQuestions = data.quiz.questions;

	$scope.currentPage = 1;
	$scope.pageItems = 6;

	$scope.scoring = 'difficulty';

	$scope.onClickBack = function() {
		$state.go('user.quizlist');
	};

	$scope.onClickEdit = function(quiz) {
		var user = authService.getUser();
		if (user.username === quiz.createdBy) {
			$location.url('/user/quiz/edit/' + quiz._id);
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
		var data = {
			"quizId": quizId,
			"user": user.username
		};

		quizResource.startQuiz(data).$promise.then(function(response) {
			$scope.gameId = response.gameId;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickPlay = function(gameId, scoring) {
		var data = {
			'gameId': gameId,
			'scoring': scoring
		};
		quizResource.playQuiz(data).$promise.then(function(response) {
			console.log(response.success);
			if(response.success) {
				$state.go('user.home');
			} else {
				$scope.playError = "Cannot start game with no signed teams.";
			}
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickDetails = function(gameId) {
		$location.url('/user/game/pending/' + gameId);
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance = modalService.questionInfoModal(question._id);
	};
};