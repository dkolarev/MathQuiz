//userGamePendingController.js

function userGamePendingController($scope, gameService, $state, data, $state, quizResource, $location, $stateParams) {
	if(data.status === 'playing') {
		$location.url('/user/game/playing/' + gameId);
	} else if (data.status === 'ended') {
		$location.url('/user/game/end/' + gameId);
	}

	var gameId = $stateParams.gameId;
	$scope.gameId = gameId;
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.teamList = data.teams;

	socket.on('newTeam', function(data) {
		$scope.teamList.push(data);
		$scope.$apply();
	});

	socket.on('gameStatus', function(data) {
		if (data.status === 'start') {
			console.log(gameId);
			$location.url('/user/game/playing/' + gameId);
		}
	});

	$scope.onClickBack = function() {
		$state.go('user.home');
	};

	$scope.onClickPlay = function(gameId) {
		quizResource.playQuiz(gameId).$promise.then(function(response) {
			console.log(response);
		}, function(response) {
			console.log(response);
		});
	};
	
	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}