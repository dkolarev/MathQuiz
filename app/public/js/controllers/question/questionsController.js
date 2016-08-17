//questionsController.js

function questionsController($scope, data, modalService, questionData) {

	
	$scope.questionsList = data.questionsList;
	$scope.totalCount = data.totalItems;

	//pagination data
	$scope.currentPage = 1;
	$scope.pageItems = 10;
	

	$scope.currentSort = '';
	$scope.reverseSort = false;


	var socket = io();

	$scope.trackByItem = function(item) {
		return item._id + item.lastModified;
	};


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

	$scope.onClickDateSort = function(currentSort, reverseSort) {
		if(currentSort == 'lastModified') {
			if (reverseSort) {
				$scope.reverseSort = false;
			} else {
				$scope.reverseSort = true;
			}
		} else {
			$scope.currentSort = 'lastModified';
			$scope.reverseSort = false;
		}
	};

	$scope.onClickNameSort = function(currentSort, reverseSort) {
		if (currentSort == 'title') {
			if (reverseSort) {
				$scope.reverseSort = false;
			} else {
				$scope.reverseSort = true;
			}
		} else {
			$scope.currentSort = 'title';
			$scope.reverseSort = false;
		}
	};

	$scope.onPageChange = function(pageItems, currentPage) {
		questionData.getQuestionsList(pageItems, currentPage).$promise.then(function(response) {
			$scope.questionsList = response.questionsList;
			$scope.totalCount = response.totalItems;
		}, function(response) {
			console.log(response);
		});
	};

	/**
	*	Kada korisnik zeli obrisati zadatak, otvori se 
	*	dijaloski okvir i zatrazi potvrda o brisanju.
	*/
	$scope.onClickDeleteQuestion = function(question) {
		var modalInstance = modalService.deleteQuestionModal(question);
	};

	/**
	*	Otvara prozor sa informacijama o pitanju.
	*/
	$scope.onClickQuestionInfo = function(question) {
		var modalInstance = modalService.questionInfoModal(question);
	};

	$scope.$on('destroy', function() {
		socket.removeAllListeners();
	});
}