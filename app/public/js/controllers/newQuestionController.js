//newQuestionController.js

function newQuestionController($scope, $state, usersData) {

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
};
