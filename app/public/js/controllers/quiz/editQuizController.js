//editQuizController.js

function editQuizController($scope, $state, modalService, quizDataRepository, data) {

	$scope.newQuiz = data.quiz;
	$scope.questionsList = data.questions;
	
  	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

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
			quizDataRepository.saveQuiz(quiz).$promise.then(function(response) {
				$state.go('user.quizzes');
			}, function(response) {
				console.log(response);
			});
		}
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance =	modalService.questionInfoModal(question);
	};

}