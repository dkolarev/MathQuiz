//userGamePendingController.js

function userGamePendingController(
	$scope, 
	gameService, 
	$state, 
	data, 
	$state, 
	quizResource, 
	$location, 
	$stateParams,
	enumData,
	modalService
) {
	if(data.status === enumData.gameStatusEnum.playingStatus) {
		$location.url('/game/playing/' + gameId);
	} else if (data.status === enumData.gameStatusEnum.endStatus) {
		$location.url('/game/end/' + gameId);
	}

	var gameId = $stateParams.gameId;
	$scope.gameId = gameId;
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);

	$scope.teamList = data.teams;
	$scope.startedBy = data.startedBy;

	$scope.scoring = 'difficulty';

	socket.on('newTeam', function(data) {
		$scope.teamList.push(data);
		$scope.$apply();
	});

	socket.on('gameStatus', function(data) {
		if (data.status === 'start') {
			$location.url('/game/playing/' + gameId);
		} else if (data.status === 'close') {
			$state.go('user.home');
		}
	});

	$scope.onClickBack = function() {
		$state.go('user.home');
	};

	$scope.onClickPlay = function(gameId, scoring) {
		var data = {
			'gameId': gameId,
			'scoring': scoring
		};
		quizResource.playQuiz(data).$promise.then(function(response) {
			if(!response.success) {
				$scope.playError = "Cannot start game with no signed teams.";
			}
			console.log(response);
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickDissolve = function(gameId) {
		var modalInstance = modalService.dissolveGameModal(gameId);
	};
	
	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}