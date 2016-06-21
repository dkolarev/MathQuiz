//userController.js

function userController($scope, $state, $window, authService, usersData, data, $uibModal) {

	//stavi korisnicko ime trenutnog korisnika na scope
	$scope.user = authService.getUser($window.localStorage.token);

	$scope.questionsList = data.questionsList;

	$scope.quizzesList = data.quizzesList;

	console.log("DAV", $scope.quizzesList);

	console.log(authService.isLogedIn);

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
				var index = $scope.questionsList.indexOf(q);	//indeks pitanja u listi
				$scope.questionsList.splice(index, 1);
				$scope.$apply();
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