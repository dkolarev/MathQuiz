//questionInfoModalController.js

function questionInfoModalController ($scope, $uibModalInstance, question, $location) {

	$scope.question = question;

	$scope.onClickClose = function() {
		$uibModalInstance.dismiss('close');
	};

	$scope.onClickEdit = function(questionId) {
		$uibModalInstance.dismiss('edit');
		$location.url('/user/questions/newquestion/' + questionId);
	};
};