//userController.js

function userController($scope, $state, $window, authService, usersData, data) {

	//stavi korisnicko ime trenutnog korisnika na scope
	$scope.user = authService.getUser($window.localStorage.token);

	$scope.questionsList = data.questionsList;

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

	$scope.onClickLogOut = function () {
		authService.logOut(function() {
			$state.go('main.index');
		});
	};
};	251