//spectatorEndController.js

function spectatorEndController($scope, gameService, $state, data, $interval) {

	data.scoreboard.sort(function(a,b) {
		return b.teamPoints - a.teamPoints;
	});

	$scope.scoreboard = data.scoreboard;

	if(data.winner) {
		$scope.winner = data.winner;
	} else {
		$scope.noWinner = true;
	}

	$scope.totalCount = data.scoreboard.length;
	$scope.currentPage = 1;
	$scope.pageItems = 10;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	socket.on('gameStatus', function(data) {
		if (data.status === 'close') {
			$state.go('main.index');
		}
	});

	$scope.onClickBackToMainPage = function() {
		gameService.deleteGameId();
		$state.go('main.index');
	};

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

		//socket.removeAllListeners();
	});
}