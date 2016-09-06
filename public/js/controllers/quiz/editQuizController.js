//editQuizController.js

function editQuizController(
	$scope, 
	$state, 
	modalService, 
	questionResource, 
	quizResource, 
	data, 
	quiz, 
	enumData,
	questionFilterService
) {
	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

	$scope.newQuiz = quiz.quiz;

	$scope.questionsList = data.questionsList;
	$scope.totalCount = data.totalItems;
	$scope.filter = questionFilterService.initializeFilter();

	$scope.fieldEnum = enumData.fieldEnum;
	$scope.difficultyEnum = enumData.difficultyEnum;

  	var socket = io();


	/**
	*	Ako je netko od korisnika obrisao pitanje u bazi,
	*	primi id pitanja od servera, pronadji pitanje u
	*	lokalnoj list te ga ukloni iz liste.
	*/
	socket.on('deleteQuestion', function(data) {
		for(var q of $scope.questionsList) {
			if(q._id == data.questionId) {
				//indeks pitanja u listi
				var index = $scope.questionsList.indexOf(q);
				$scope.questionsList.splice(index, 1);
				$scope.$apply();
				break;
			}
		}
	});

  	$scope.trackByItem = function(item) {
		return item._id + item.lastModified;
	};

  	$scope.onClickSave = function(quiz) {
		if(quiz.questions.length > 0 && $scope.newQuizForm.$valid) {
			quizResource.editQuiz(quiz._id, quiz).$promise.then(function(response) {
				if (response.success) {
					$state.go('user.quizlist');
				} else {
					console.log(response);
				}
			}, function(response) {
				console.log(response);
			});
		}
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance =	modalService.questionInfoModal(question._id);
	};

	$scope.onPageChange = function(filter) {
		questionResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.questionsList = response.questionsList;
			$scope.totalItems = response.totalItems;
		})
	};

	$scope.onClickFilter = function(filter) {
		questionResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.questionsList = response.questionsList;
			$scope.totalCount = response.totalItems;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickClearFieldFilter = function(filter) {
		filter = questionFilterService.clearFieldFilter(filter);
	};

	$scope.onClickClearDifficultyFilter = function(filter) {
		filter = questionFilterService.clearDifficultyFilter(filter);
	};


	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}