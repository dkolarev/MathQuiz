//gamePendingController.js

function gamePendingController($scope, gameService) {

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.teamList = [
		{id: 1, name: 'Team1'},
		{id: 2, name: 'Team2'},
		{id: 3, name: 'Team3'},
		{id: 4, name: 'Team4'},
		{id: 5, name: 'Team5'},
		{id: 6, name: 'Team6'},
		{id: 7, name: 'Team7'},
		{id: 8, name: 'Team8'},
		{id: 9, name: 'Team9'},
		{id: 10, name: 'Team10'},
		{id: 11, name: 'Team11'}
	];

	socket.on('newTeam', function(data) {
		$scope.teamList.push(data);
		$scope.$apply();
	});
}