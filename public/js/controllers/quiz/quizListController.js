//quizListController.js

function quizListController($scope, data, quizResource, enumData, quizFilterService) {

	$scope.quizzesList = data.quizzesList;
	$scope.totalCount = data.totalItems;
	$scope.fixedAmount = data.totalItems;

	$scope.fieldEnum = enumData.fieldEnum;
	$scope.ratingEnum = enumData.ratingEnum;

	$scope.filter = quizFilterService.initializeFilter();

	var socket = io();

	/**
	*	Ako je kviz obrisan u bazi, primi od servera
	*	id obrisanog kviza te ga ukloni iz liste s kvizovima.
	*/
	socket.on('deleteQuiz', function(data) {
		for(var quiz of $scope.quizzesList) {
			if(quiz._id == data.quizId) {
				var index = $scope.quizzesList.indexOf(quiz);
				$scope.quizzesList.splice(index, 1);
				$scope.$apply();
				break;
			}
		}
	});

	$scope.onPageChange = function(filter) {
		quizResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.quizzesList = response.quizzesList;
			$scope.totalCount = response.totalItems; 
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickClearFieldFilter = function(filter) {
		filter = quizFilterService.clearFieldFilter(filter);
	};

	$scope.onClickClearRatingFilter = function(filter) {
		filter = quizFilterService.clearRatingFilter(filter);
	};

	$scope.onClickFilter = function(filter) {
		quizResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.quizzesList = response.quizzesList;
			$scope.totalCount = response.totalItems;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}