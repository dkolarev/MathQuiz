//gameController.js

function gameController(
	$scope, 
	$rootScope, 
	gameService, 
	data, 
	correctAnswerService, 
	gameResource, 
	modalService,
	$state,
	$interval
) {

	$scope.answerSended = false;
	$scope.teamSended = false;

	$scope.showAlert = false;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.currentQuestion = data.question;
	$scope.scoreboard = data.scoreboard;

	$scope.totalCount = $scope.scoreboard.length;
	$scope.currentPage = 1;
	$scope.pageItems = 10;

	socket.on('gameStatus', function(data) {
		if (data.status == 'end') {
			if($scope.modalInstance) {
				$scope.modalInstance.close('close');
			}
			$state.go('quizend');
		}
	});

	socket.on('question', function(data) {
		if($scope.modalInstance) {
			$scope.modalInstance.close('close');
		}
		correctAnswerService.resetButtonsColors();

		$scope.currentQuestion = data.question;
		$scope.timer = data.time;
		$scope.answerSended = false;

		$scope.$apply();
	});

	socket.on('timer', function(data) {
		$scope.timer = data.timer;
		$scope.$apply();
	});

	socket.on('scoreboard', function(data) {
		$scope.scoreboard = data.scoreboard;
	});

	socket.on('correctAnswer', function(data) {
		var correctAnswer = data.correctAnswer;

		$scope.modalInstance = modalService.correctAnswerModal(correctAnswer);
	});

	$scope.onClickSendAnswer = function(answer, questionId, buttonId, answerTime) {
		var data = {
			'answer': answer,
			'questionId': questionId,
			'teamId': $rootScope.team.teamId,
			'answerTime': answerTime
		};

		gameResource.sendAnswer(data).$promise.then(function(response) {
			$scope.answerSended = true;

			correctAnswerService.setCorrectColor(response.correct, buttonId);
		}, function(response) {
			console.log(response);
		});
	};

	var scoreboardTimer = $interval(function() {
		if ($scope.currentPage >= $scope.totalCount / $scope.pageItems) {
			$scope.currentPage = 1;
		} else {
			$scope.currentPage++;
		}
	}, 5000);

	$scope.$on('$destroy', function() {
		if(angular.isDefined(scoreboardTimer)) {
			$interval.cancel(scoreboardTimer);
		}

		socket.removeAllListeners();
	});
}