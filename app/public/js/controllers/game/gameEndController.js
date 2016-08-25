//gameEndController.js

function gameEndController($scope, $state, data, gameService, playerService) {

	$scope.scoreboard = data.scoreboard;
	$scope.winner = data.winner;
	$scope.rated = false;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	socket.on('gameStatus', function(data) {
		if (data.status == 'close') {
			$state.go('main.index');
		}
	});

	$scope.onClickBackToMainPage = function() {
		gameService.deleteGameId();
		$state.go('main.index');
	};

	$scope.rateFunction = function(rating) {
		if (!$scope.rated) {	
			playerService.sendRating({rating: rating}).$promise.then(function(response) {
				console.log(response);
			}, function(response) {
				console.log(response);
			});
		}
		$scope.rated = true;
	};

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}