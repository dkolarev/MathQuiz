//quizListController.js

function quizListController($scope, data, quizData, enumData) {

	$scope.quizzesList = data.quizzesList;
	$scope.totalCount = data.totalItems;
	$scope.fixedAmount = data.totalItems;

	$scope.fieldEnum = enumData.fieldEnum;
	$scope.ratingEnum = enumData.ratingEnum;

	$scope.filter = {
		currentPage: 1,
		pageItems: 4,
		fieldFilter: [],
		ratingFilter: [],
		sortFilter: 'title',
		sortOrder: 1
	};

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
		quizData.getFilteredList(filter).$promise.then(function(response) {
			$scope.quizzesList = response.quizzesList;
			$scope.totalCount = response.totalItems; 
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickClearFieldFilter = function(filter) {
		filter.fieldFilter = [];
	};

	$scope.onClickClearRatingFilter = function(filter) {
		filter.ratingFilter = [];
	};

	$scope.onClickFilter = function(filter) {
		quizData.getFilteredList(filter).$promise.then(function(response) {
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