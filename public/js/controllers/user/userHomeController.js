//userHomeController.js

function userHomeController (
	$scope, 
	data, 
	$interval, 
	quizResource, 
	$location, 
	enumData, 
	$window, 
	modalService
) {

	$scope.dashboard = data.dashboard;

	$scope.pageItemsTest = 5;
	$scope.currentPageTest = 1;
	$scope.totalCountTest = 17;

	$scope.pageItems = 3;
	$scope.currentPage = 1;
	$scope.totalCount = $scope.dashboard.length;

	$scope.scoring = 'difficulty';

	var socket = io();

	socket.on('dashboardUpdate', function(data) {
		if($scope.dashboard.length == 0) {
			$scope.dashboard.push(data.item);
		} else {
			for(game of $scope.dashboard) {
				if (game.gameId === data.item.gameId) {
					var index = $scope.dashboard.indexOf(game);
					$scope.dashboard[index] = data.item;
					$scope.totalCount = $scope.dashboard.length;
					$scope.$apply();
					return;
				}
			}
			$scope.dashboard.push(data.item);
			$scope.totalCount = $scope.dashboard.length;
		}
		$scope.$apply();
	});

	socket.on('removeDashboardElement', function(data) {
		for (game of $scope.dashboard) {
				if (game.gameId === data.gameId) {
					var index = $scope.dashboard.indexOf(game);
					$scope.dashboard.splice(index, 1);
					$scope.totalCount = $scope.dashboard.length;
					$scope.$apply();
				}
		}
	});

	var dashboardTimer = $interval(function() {
		if ($scope.currentPage >= $scope.totalCount / $scope.pageItems) {
			$scope.currentPage = 1;
		} else {
			$scope.currentPage++;
		}
	}, 10000);

	$scope.onClickPlay = function(gameId, scoring) {
		var data = {
			'gameId': gameId,
			'scoring': scoring
		};
		quizResource.playQuiz(data).$promise.then(function(response) {
			if(!response.success) {
				$scope.playError = "Cannot play game with no signed teams.";
			}
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickWatch = function(gameId, gameStatus) {
		if(gameStatus === enumData.gameStatusEnum.pendingStatus) {
			$location.url('/user/game/pending/' + gameId);
		} else if(gameStatus === enumData.gameStatusEnum.playingStatus) {
			$location.url('/user/game/playing/' + gameId);
		} else {
			$location.url('/user/game/end/' + gameId);
		}
	};

	$scope.onClickDissolve = function(gameId) {
		var modalInstance = modalService.dissolveGameModal(gameId);
	};	

	$scope.$on('$destroy', function() {
		if(angular.isDefined(dashboardTimer)) {
			$interval.cancel(dashboardTimer);
		}

		socket.removeAllListeners();
	});
}