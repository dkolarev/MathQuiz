//userGameEndController.js

function userGameEndController($scope, gameService, $state, data, $stateParams) {

	$scope.scoreboard = data.scoreboard;
	$scope.winner = data.winner;

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

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}