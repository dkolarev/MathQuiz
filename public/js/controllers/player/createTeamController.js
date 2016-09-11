//createTeamController.js

function createTeamController($scope, $state, gameResource, gameService) {

	$scope.team = {};
	$scope.player = "";
	$scope.team.players = [{'id':1}];

	//provjeri je li korisnik vec unio podatke
	if(gameService.getTeamId()) {
		$scope.teamSended = true;
		$scope.showAlert = true;
	} else {
		$scope.teamSended = false;
		$scope.showAlert = false;
	}

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);


	socket.on('gameStatus', function(data) {
		if (data.status === 'start') {
			$state.go('quizgame');
		} else if (data.status === 'close') {
			$state.go('main.index');
		}
	});

	/**
	*	Nakon klika na '+' dodaje novog igraca u listu
	*	team.players i omogucuje unos imena igraca.
	*/
	$scope.onClickAddNewPlayer = function() {
		var newPlayerNo = $scope.team.players.length + 1;
		$scope.team.players.push({'id': newPlayerNo});
	};

	/**
	*	Klikom na '-' brise zadnjeg igraca iz liste team.players.
	*/
	$scope.onClickRemovePlayer = function(player) {
		var index = $scope.team.players.indexOf(player);
		$scope.team.players.splice(index, 1);
	};

	$scope.onClickReady = function(team) {
		if(team.players[0].name) {
			gameResource.saveTeam(team).$promise.then(function(response) {
			if(response.success) {
				gameService.saveTeamId(response.teamId);
				$scope.teamSended = true;
				$scope.showAlert = true;
			} else {
				$scope.gameStarted = response.message;
			} 		
		}, function(response) {
			console.log(response);
		});
		} else {
			$scope.playersError = 'At least one player required.';
		}
	};

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
};