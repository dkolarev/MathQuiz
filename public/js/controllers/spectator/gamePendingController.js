//gamePendingController.js

function gamePendingController($scope, gameService, $state, data) {


	if(data.status === 'playing') {
		$state.go('spectatorgame');
	} else if (data.status === 'ended') {
		$state.go('spectatorend');
	}

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.teamList = data.teams;

	socket.on('newTeam', function(data) {
		$scope.teamList.push(data);
		$scope.$apply();
	});

	socket.on('gameStatus', function(data) {
		if (data.status === 'start') {
			$state.go('spectatorgame');
		} else if (data.status === 'close') {
			$state.go('main.index');
		}
	});

	
	/*$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});*/
}