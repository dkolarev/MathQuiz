//gameEndController.js

function gameEndController($scope, data, gameService) {

	$scope.scoreboard = data.scoreboard;

	$scope.winner = data.winner;

	$scope.rated = false;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.onClickBackToMainPage = function() {
		gameService.deleteGameId();
		$state.go('main.index');
	};

	$scope.rateFunction = function(rating) {
		if (!$scope.rated) {
			/*
			playerService.sendRating({rating: rating}).$promise.then(function(response) {
				console.log(response);
				$scope.rated = true;
			}, function(response) {
				console.log(response);
			});*/
			$scope.rated = true;
		}
	};
}