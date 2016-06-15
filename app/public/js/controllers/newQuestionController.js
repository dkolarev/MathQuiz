//newQuestionController.js

function newQuestionController($scope, $state, usersData) {

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
			question.createdBy = $scope.user.username;
			usersData.saveQuestion(question).$promise.then(function (response) {
				$state.go('user.questions');
			}, function (response) {
				console.log(response);
			});
			console.log(question);
		}
	};
};
