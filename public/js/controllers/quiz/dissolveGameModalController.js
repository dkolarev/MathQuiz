//dissolveGameModalController.js

function dissolveGameModalController($scope, gameId, $uibModalInstance, quizResource) {

	$scope.gameId = gameId;

	$scope.onClickYes = function (gameId) {
		quizResource.dissolveGame(gameId).$promise.then(function(response) {
			if(response.success) {
				$uibModalInstance.dismiss('ok');
			}		
		}, function(response) {
			console.log(response);
		});
	};

	$scope.onClickNo = function() {
		$uibModalInstance.dismiss('cancel');
	};
}