//deleteQuestionModalController.js

function deleteQuestionModalController ($scope, $uibModalInstance, question, questionDataRepository) {
	$scope.question = question;

	$scope.onClickYes = function(questionId) {
		questionDataRepository.deleteQuestion(questionId);
		$uibModalInstance.dismiss('ok');
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
};