//spectatorEndController.js

function spectatorEndController($scope, gameService, $state, data) {

	data.scoreboard.sort(function(a,b) {
		return (a.teamPoints - b.teamPoints) ? 1 : ((b.teamPoints - a.teamPoints) ? -1 : 0);
	});

	$scope.scoreboard = data.scoreboard;
	$scope.winner = data.winner;

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

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}