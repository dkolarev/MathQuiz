//spectatorController.js

function spectatorController(
	$scope, 
	gameService, 
	$state,
	data,
	gameResource,
	modalService,
	$interval
) {
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
		if (data.status === 'end') {
			if($scope.modalInstance) {
				$scope.modalInstance.close('close');
			}
			$state.go('spectatorend');
		}
	});

	socket.on('question', function(data) {
		if($scope.modalInstance) {
			$scope.modalInstance.close('close');
		}

		$scope.currentQuestion = data.question;
		$scope.timer = data.time;

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
		$scope.scoreboard = data.scoreboard;
	});

	socket.on('correctAnswer', function(data) {
		var correctAnswer = data.correctAnswer;

		$scope.modalInstance = modalService.correctAnswerModal(correctAnswer);
	});

	var scoreboardTimer = $interval(function() {
		if ($scope.currentPage >= $scope.totalCount / $scope.pageItems) {
			$scope.currentPage = 1;
		} else {
			$scope.currentPage++;
		}
	}, 10000);

	$scope.$on('$destroy', function() {
		if(angular.isDefined(scoreboardTimer)) {
			$interval.cancel(scoreboardTimer);
		}

		socket.removeAllListeners();
	});
}