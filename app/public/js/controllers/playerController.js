function playerController($scope, 
						$rootScope, 
						$state, 
						playerService, 
						gameService, 
						modalService,
						correctAnswerService) {

	$scope.config = {
    	theme: 'minimal-dark',
    	axis: 'y'
  	};

	$scope.team = {};
	$scope.player = "";
	$scope.team.players = [{'id':1}];

	$scope.answerSended = false;
	$scope.teamSended = false;

	$scope.showAlert = false;

	$scope.rated = false;

	var gameId = gameService.getGameId();
	var socketNamespace = '/' + gameId;
	var socket = io(socketNamespace);


	socket.on('gameStatus', function(data) {
		if (data.status == 'start') {
			$rootScope.team = $scope.team;
			$state.go('quizgame');
		}
	});

	socket.on('question', function(data) {
		if($scope.modalInstance) {
			$scope.modalInstance.close('close');
		}

		$rootScope.currentQuestion = data.question;
		$rootScope.timer = data.time;
		$scope.answerSended = false;

		correctAnswerService.resetButtonsColors();

		$rootScope.$apply();
	});

	socket.on('timer', function(data) {
		$rootScope.timer = data.timer;
		$rootScope.$apply();
	});

	socket.on('scoreboard', function(data) {
		$rootScope.scoreboard = data.scoreboard;
	});

	socket.on('correctAnswer', function(data) {
		var correctAnswer = data.correctAnswer;

		$scope.modalInstance = modalService.correctAnswerModal(correctAnswer);
	});


	/**
	*	Nakon klika na '+' dodaje novog igraca u listu
	*	team.players i omogucuje unos imena igraca.
	*/
	$scope.onClickAddNewPlayer = function() {
		var newPlayerNo = $scope.team.players.length + 1;
		$scope.team.players.push({'id': newPlayerNo});
	};

	/**
	*	Klikom na '-' brise zadnjeg igraca iz liste team.players.
	*/
	$scope.onClickRemovePlayer = function(player) {
		var index = $scope.team.players.indexOf(player);
		$scope.team.players.splice(index, 1);
	};

	$scope.onClickReady = function(team) {
		playerService.saveTeam(team).$promise.then(function(response) {
			$scope.team.teamId = response.teamId;
			$scope.teamSended = true;
			$scope.showAlert = true;
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickSendAnswer = function(answer, questionId, buttonId) {
		var data = {
			answer: answer,
			questionId: questionId,
			teamId: $rootScope.team.teamId
		};

		playerService.sendAnswer(data).$promise.then(function(response) {
			$scope.answerSended = true;

			correctAnswerService.setCorrectColor(response.correct, buttonId);
		}, function(response) {
			console.log(response);
		});
	};

	$scope.rateFunction = function(rating) {
		if (!$scope.rated) {
			/*
			playerService.sendRating({rating: rating}).$promise.then(function(response) {
				console.log(response);
				$scope.rated = true;
			}, function(response) {
				console.log(response);
		});*/
		$scope.rated = true;
		}
	};

	$scope.onClickBackToMainPage = function() {
		$state.go('main.index');
	};
};