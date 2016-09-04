//createTeamController.js

function createTeamController($scope, $rootScope, $state, gameResource, gameService) {
	
	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

	$rootScope.team = {};
	$scope.player = "";
	$scope.team.players = [{'id':1}];

	$scope.answerSended = false;
	$scope.teamSended = false;

	$scope.showAlert = false;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);


	socket.on('gameStatus', function(data) {
		if (data.status === 'start') {
			$rootScope.team = $scope.team;
			$state.go('quizgame');
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
		gameResource.saveTeam(team).$promise.then(function(response) {
			if(response.success) {
				$rootScope.team.teamId = response.teamId;
				$scope.teamSended = true;
				$scope.showAlert = true;
			} else {
				console.log(response);
			}
			
		}, function(response) {
			console.log(response);
		});
	};

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
};