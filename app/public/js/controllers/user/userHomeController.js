//userHomeController.js

function userHomeController ($scope, data, $interval, quizResource) {

	$scope.dashboard = data.dashboard;

	$scope.pageItemsTest = 5;
	$scope.currentPageTest = 1;
	$scope.totalCountTest = 17;

	$scope.pageItems = 3;
	$scope.currentPage = 1;
	$scope.totalCount = $scope.dashboard.length;

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
	}, 5000);

	$scope.onClickPlay = function(gameId) {
		quizResource.playQuiz(gameId).$promise.then(function(response) {
			console.log(response);
		}, function(response) {
			console.log(response);
		});
	};	

	$scope.$on('$destroy', function() {
		if(angular.isDefined(dashboardTimer)) {
			$interval.cancel(dashboardTimer);
		}

		socket.removeAllListeners();
	});
}