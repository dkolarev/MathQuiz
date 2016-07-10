function playerController($scope, playerService) {

	$scope.team = {};
	$scope.player = "";
	$scope.team.players = [{'id':1}];


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
		playerService.saveTeam(team).$promise.then(function(response) {
			$scope.team.teamId = response.teamId;
		}, function(response) {
			console.log(response);
		});
	};
};