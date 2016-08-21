//questionListController.js

function questionListController($scope, data, modalService, questionResource, enumData) {

	
	$scope.questionsList = data.questionsList;
	$scope.totalCount = data.totalItems;

	$scope.fieldEnum = enumData.fieldEnum;
	$scope.difficultyEnum = enumData.difficultyEnum;

	$scope.filter = {
		currentPage: 1,
		pageItems: 10,
		fieldFilter: [],
		difficultyFilter: [],
		sortFilter: 'title',
		sortOrder: 1
	};


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
		if(currentSort === 'lastModified') {
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

	$scope.onClickDateSort = function(filter) {
		if(filter.sortFilter === 'lastModified') {
			if(filter.sortOrder === 1) {
				filter.sortOrder = -1;
			} else {
				filter.sortOrder = 1;
			}
		} else {
			filter.sortFilter = 'lastModified';
			filter.sortOrder = 1;
		}

		questionResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.questionsList = response.questionsList;
			$scope.totalCount = response.totalItems;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickNameSort = function(filter) {
		if(filter.sortFilter === 'title') {
			if (filter.sortOrder === 1) {
				filter.sortOrder = -1;
			} else {
				filter.sortOrder = 1;
			}
		} else {
			filter.sortFilter = 'title';
			filter.sortOrder = 1;
		}

		questionResource.getFilteredList(filter).$promise.then(function(response) {
			$scope.questionsList = response.questionsList;
			$scope.totalCount = response.totalItems;
		}, function(response) {
			console.log(Response);
		})
	}

	$scope.onPageChange = function(filter) {
		questionResource.getFilteredList(filter).$promise.then(function(response) {
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
	$scope.onClickQuestionInfo = function(questionId) {
		var modalInstance = modalService.questionInfoModal(questionId);
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
}