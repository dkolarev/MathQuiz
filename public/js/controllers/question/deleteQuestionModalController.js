//deleteQuestionModalController.js

function deleteQuestionModalController ($scope, $uibModalInstance, question, questionResource) {
	$scope.question = question;

	$scope.onClickYes = function(questionId) {
		questionResource.deleteQuestion(questionId);
		$uibModalInstance.dismiss('ok');
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
};