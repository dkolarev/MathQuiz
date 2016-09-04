//gameEndController.js

function gameEndController($scope, $state, data, gameService, gameResource, $interval) {

	data.scoreboard.sort(function(a,b) {
		return (a.teamPoints - b.teamPoints) ? 1 : ((b.teamPoints - a.teamPoints) ? -1 : 0);
	});

	$scope.scoreboard = data.scoreboard;
	$scope.winner = data.winner;
	$scope.rated = false;

	$scope.totalCount = data.scoreboard.length;
	$scope.currentPage = 1;
	$scope.pageItems = 2;

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

		socket.removeAllListeners();
	});
}