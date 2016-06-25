//deleteQuestionModalController.js

function deleteQuestionModalController ($scope, $uibModalInstance, question, usersData) {
	$scope.question = question;

	$scope.onClickYes = function(questionId) {
		usersData.deleteQuestion(questionId);
		$uibModalInstance.dismiss('ok');
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
};