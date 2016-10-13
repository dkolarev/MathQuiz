//gameController.js

function gameController(
	$scope, 
	gameService, 
	data, 
	correctAnswerService, 
	gameResource, 
	modalService,
	$state,
	$interval
) {
	if(data.answered) {
		$scope.answerSended = true;
	} else {
		$scope.answerSended = false;
	}

	$scope.teamId = gameService.getTeamId();
	var gameId = gameService.getGameId();
	
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.currentQuestion = data.question;

	data.scoreboard.sort(function(a,b) {
		return b.teamPoints - a.teamPoints;
	});

	$scope.scoreboard = data.scoreboard;

	$scope.totalCount = data.scoreboard.length;
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
		data.scoreboard.sort(function(a,b) {
			return b.teamPoints - a.teamPoints;
		});
		console.log(data.scoreboard);
		$scope.scoreboard = data.scoreboard;
		$scope.$apply();
	});

	socket.on('correctAnswer', function(data) {
		var correctAnswer = data.correctAnswer;

		$scope.modalInstance = modalService.correctAnswerModal(correctAnswer);
	});

	$scope.onClickSendAnswer = function(answer, questionId, buttonId, answerTime) {
		var teamId = gameService.getTeamId();
		var data = {
			'answer': answer,
			'questionId': questionId,
			'teamId': teamId,
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
	}, 10000);

	/*$scope.$on('$destroy', function() {
		if(angular.isDefined(scoreboardTimer)) {
			$interval.cancel(scoreboardTimer);
		}

		socket.removeAllListeners();
	});*/
}