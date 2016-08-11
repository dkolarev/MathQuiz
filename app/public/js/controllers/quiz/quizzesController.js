//quizzesController.js

function quizzesController($scope, data) {

	$scope.quizzesList = data.quizzesList;

	//pagination data
	$scope.currentPage = 1;
	$scope.pageSize = 4;

	var socket = io();

	/**
	*	Ako je netko dodao novi kviz u bazu, primi
	*	od servera kviz i ubaci ga u lokalnu listu
	*	sa kvizovima.
	*/
	socket.on('newQuiz', function(data) {
		$scope.quizzesList.push(data);
		$scope.$apply();
	});

	/**
	*	Ako je doslo do promijene nekog kviza u bazi,
	*	primi promijenjeni kviz te ga zamijeni sa starim.
	*/
	socket.on('updateQuiz', function(data) {
		for (var quiz of $scope.quizzesList) {
			if (quiz._id == data._id) {
				//indeks zadatka kojeg treba zamijeniti u listi
				var index = $scope.quizzesList.indexOf(quiz);
				$scope.quizzesList[index] = data;	//postavi novi zadatak
				$scope.$apply();
				break;
			}
		}
	});

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

	socket.on('deleteQuestion', function(data) {
		for(var quiz of $scope.quizzesList) {
			for(var questionId of quiz.questions) {
				if(questionId == data.questionId) {
					var index = quiz.questions.indexOf(questionId);
					quiz.questions.splice(index, 1);
					$scope.$apply();
					break;
				}
			}
		}
	});
}