//spectatorEndController.js

function spectatorEndController($scope, gameService, $state, data) {

	$scope.scoreboard = data.scoreboard;
	$scope.winner = data.winner;

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

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}