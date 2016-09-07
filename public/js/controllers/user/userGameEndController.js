//userGameEndController.js

function userGameEndController($scope, gameService, $state, data, $stateParams, $interval) {

	data.scoreboard.sort(function(a,b) {
		return (a.teamPoints - b.teamPoints) ? 1 : ((b.teamPoints - a.teamPoints) ? -1 : 0);
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

	var gameId = $stateParams.gameId;
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	socket.on('gameStatus', function(data) {
		if (data.status === 'close') {
			$state.go('user.home');
		}
	});

	$scope.onClickBack = function() {
		$state.go('user.home');
	}

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