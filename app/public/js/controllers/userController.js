//userController.js

function userController($scope, $state, $window, authService, usersData, data, $uibModal) {

	//stavi korisnicko ime trenutnog korisnika na scope
	$scope.user = authService.getUser($window.localStorage.token);

	$scope.questionsList = data.questionsList;

	$scope.quizzesList = data.quizzesList;

	var socket = io();

	$scope.trackByItem = function(item) {
		return item._id + item.lastModified;
	};

	/**
	*	Primi od servera novo pitanje i stavi ga
	*	u listu.
	*/
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

		//obrisi odgovarajuce pitanje i u listi s kvizovima
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

	/**
	*	Kada korisnik zeli obrisati zadatak, otvori se 
	*	dijaloski okvir i zatrazi potvrda o brisanju.
	*/
	$scope.onClickDeleteQuestion = function(question) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'deleteQuestionModal.html',
			size: 'sm',
			resolve: {
				question: function() {
					return question;
				}
			},
			controller: 'deleteQuestionModalController'
		});
	};

	$scope.onClickQuestionInfo = function(question) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'QuestionInfoModal.html',
			size: 'lg',
			resolve: {
				question: function() {
					return question;
				}
			},
			controller: 'questionInfoModalController'
		});
	};

	$scope.onClickLogOut = function () {
		authService.logOut(function() {
			$state.go('main.index');
		});
	};
};	