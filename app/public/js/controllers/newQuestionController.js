//newQuestionController.js

function newQuestionController($scope, $state, usersData, uploadFile) {

	$scope.newQuestion = {};

	/*
	*	Ako je kao URL parametar predan id zadatka
	*	provjeri jel postoji u listi sa zadatcima i postavi
	*	ga kao varijablu newQuestion na scope. Time se omogucava
	*	modifikacija vec postojeceg zadatka.
	*/
	(function() {
		for (var q of $scope.questionsList) {
			if ($state.params.questionId == q._id) {
				$scope.newQuestion = q;
				break;
			}
		}
	})();

	$scope.onClickText = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\text{ }";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\text{ }";
		}
	};

	$scope.onClickSum = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sum_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sum_";
		}
	};

	$scope.onClickProduct = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\prod_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\prod_";
		}
	};

	$scope.onClickSqrt = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sqrt{ }";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sqrt{ }";
		}
	};

	$scope.onClickIntegral = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\int_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\int_";
		}
	};

	$scope.onClickLim = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\lim_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\lim_";
		}
	};

	$scope.onClickFrac = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\frac{ }{ }";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\frac{ }{ }";
		}
	};

	$scope.onClickSin = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sin ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sin ";
		}
	};

	$scope.onClickCos = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\cos ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\cos ";
		}
	};

	$scope.onClickTan = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\tan ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\tan ";
		}
	};

	$scope.onClickCot = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\cot ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\cot ";
		}
	};

	$scope.onClickArcSin = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arcsin ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arcsin ";
		}
	};

	$scope.onClickArcCos = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arccos ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arccos ";
		}
	};

	$scope.onClickArcTan = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arctan ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arctan ";
		}
	};

	$scope.onClickArcCot = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arg ";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arg ";
		}
	};

	$scope.onClickSaveQuestion = function (question) {
		if($scope.newQuestionForm.$valid) {
			//zadatku dodaj informaciju tko ga je kreirao
			if(!question.createdBy)
				question.createdBy = $scope.user.username;

			usersData.saveQuestion(question).$promise.then(function (response) {
				$state.go('user.questions');
			}, function (response) {
				console.log(response);
			});
		}
	};

	$scope.onClickUpload = function(element) {
   		uploadFile.upload(element, function(image) {
   			$scope.newQuestion.image = image;
   			$scope.$apply();
   		})
	};
};
