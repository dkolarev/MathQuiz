//newQuizController.js

function newQuizController ($scope, $state, modalService, questionResource, quizData, data, quiz, enumData) {

	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

	if(quiz.quiz) {
		$scope.newQuiz = quiz.quiz;
	} else {
		$scope.newQuiz = {};
		$scope.newQuiz.questions = [];
	}

	$scope.questionsList = data.questionsList;
	$scope.totalCount = data.totalItems;
	$scope.filter = {
			currentPage: 1,
			pageItems: 10,
			fieldFilter: [],
			difficultyFilter: [],
			sortFilter: 'title',
			sortOrder: 1
	};

	$scope.fieldEnum = enumData.fieldEnum;
	$scope.difficultyEnum = enumData.difficultyEnum;

  	var socket = io();

  	socket.on('newQuestion', function (data) {
		$scope.questionsList.push(data);
		$scope.$apply();
	});

	/**
	*	Ukoliko je netko od korisnika napravio promjene
	*	na nekom od pitanja. Pronadji podudaranost po
	*	id-u, i na odgovarajucem indeksu ubaci pitanje.
	*	(napraviti ce se zamijena)
	*/
	socket.on('updateQuestion', function(data) {
		for(var q of $scope.questionsList) {
			if(q._id == data._id) {
				var index = $scope.questionsList.indexOf(q); //index popudaranog pitanja
				$scope.questionsList[index] = data;
				$scope.$apply();
				break;
			}				
		}
	});

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
			if(!quiz.createdBy)
				quiz.createdBy = $scope.user.username;
			quizData.saveQuiz(quiz).$promise.then(function(response) {
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
		filter.fieldFilter = [];
	};

	$scope.onClickClearDifficultyFilter = function(filter) {
		filter.difficultyFilter = [];
	};


	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
};