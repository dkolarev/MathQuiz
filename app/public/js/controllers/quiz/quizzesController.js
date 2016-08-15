//quizzesController.js

function quizzesController($scope, data, quizData) {

	$scope.quizzesList = data.quizzesList;
	$scope.totalCount = data.totalItems;

	//pagination data
	$scope.currentPage = 1;
	$scope.pageItems = 4;

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

	$scope.onPageChange = function(pageItems, currentPage) {
		quizData.getQuizzesList(pageItems, currentPage).$promise.then(function(response) {
			$scope.quizzesList = response.quizzesList;
			$scope.totalCount = response.totalItems; 
		}, function(response) {
			console.log(response);
		});
	};
}