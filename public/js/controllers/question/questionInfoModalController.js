//questionInfoModalController.js

function questionInfoModalController ($scope, $uibModalInstance, data, $location) {

	$scope.question = data.question;

	$scope.onClickClose = function() {
		$uibModalInstance.dismiss('close');
	};

	$scope.onClickEdit = function(questionId) {
		$uibModalInstance.dismiss('edit');
		$location.url('/question/edit/' + questionId);
	};
};