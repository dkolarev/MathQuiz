//userHomeController.js

function userHomeController ($scope, data, $interval) {

	$scope.dashboard = data.dashboard;

	/*
	$scope.dashboard = [
		{gameId: "sdadasdsa", title: "kviz_1", questionsNumber: 10, currentQuestionPointer: 0},
		{gameId: "sdadasasdsa", title: "kviz_2", questionsNumber: 7, currentQuestionPointer: 1},
		{gameId: "sdxaaa", title: "kviz_3", questionsNumber: 7, currentQuestionPointer: 5},
		{gameId: "sdxaaaasa", title: "kviz_4", questionsNumber: 8, currentQuestionPointer: 4},
		{gameId: "sdxaaaasawq", title: "kviz_5", questionsNumber: 9, currentQuestionPointer: 4},
		{gameId: "sdxaaaasawqeqwe", title: "kviz_6", questionsNumber: 10, currentQuestionPointer: 7},
		{gameId: "sdxaaaasawqqwq", title: "kviz_7", questionsNumber: 10, currentQuestionPointer: 10}
	];*/

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

	var dashboardTimer = $interval(function() {
		if ($scope.currentPage > $scope.totalCount / $scope.pageItems) {
			$scope.currentPage = 1;
		} else {
			$scope.currentPage++;
		}
	}, 5000);

	$scope.$on('$destroy', function() {
		if(angular.isDefined(dashboardTimer)) {
			$interval.cancel(dashboardTimer);
		}

		socket.removeAllListeners();
	});
}