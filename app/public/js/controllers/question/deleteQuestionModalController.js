//deleteQuestionModalController.js

function deleteQuestionModalController ($scope, $uibModalInstance, question, questionData) {
	$scope.question = question;

	$scope.onClickYes = function(questionId) {
		questionData.deleteQuestion(questionId);
		$uibModalInstance.dismiss('ok');
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
};