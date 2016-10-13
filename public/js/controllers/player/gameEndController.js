//gameEndController.js

function gameEndController($scope, $state, data, gameService, gameResource, $interval) {

	data.scoreboard.sort(function(a,b) {
		return b.teamPoints - a.teamPoints;
	});

	$scope.scoreboard = data.scoreboard;

	if(data.winner) {
		$scope.winner = data.winner;
	} else {
		$scope.noWinner = true;
	}

	$scope.rated = false;

	$scope.totalCount = data.scoreboard.length;
	$scope.currentPage = 1;
	$scope.pageItems = 10;

	$scope.teamId = gameService.getTeamId();
	var gameId = gameService.getGameId();

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	socket.on('gameStatus', function(data) {
		if (data.status === 'close') {
			gameService.deleteGameId();
			gameService.deleteTeamId();
			$state.go('main.index');
		}
	});

	$scope.onClickBackToMainPage = function() {
		gameService.deleteGameId();
		gameService.deleteTeamId();
		$state.go('main.index');
	};

	$scope.rateFunction = function(rating) {
		if (!$scope.rated) {	
			gameResource.sendRating({rating: rating}).$promise.then(function(response) {
				console.log(response);
			}, function(response) {
				console.log(response);
			});
		}
		$scope.rated = true;
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