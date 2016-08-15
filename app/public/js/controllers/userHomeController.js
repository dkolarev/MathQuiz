//userHomeController.js

function userHomeController ($scope, data) {
	$scope.activeGames = data.games;

	var socket = io();
}