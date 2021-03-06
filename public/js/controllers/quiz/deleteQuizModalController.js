//deleteQuizModalController.js

function deleteQuizModalController ($scope, $state, $uibModalInstance, quiz, quizResource) {

	$scope.quiz = quiz;

	$scope.onClickYes = function (quizId) {
		quizResource.deleteQuiz(quizId).$promise.then(function(response) {
			$uibModalInstance.dismiss('ok');
			$state.go('user.quizlist');
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
}