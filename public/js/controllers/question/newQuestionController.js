//newQuestionController.js

function newQuestionController($scope, $state, questionResource, uploadFile, enumData) {

	$scope.newQuestion = {};

	$scope.selectList = enumData.fieldEnum;

	$scope.onClickRemoveImage = function(question) {
		question.image = null;
	};

	$scope.onClickSaveQuestion = function (question) {
		if($scope.newQuestionForm.$valid) {
			question.createdBy = $scope.user.username;
			questionResource.saveQuestion(question).$promise.then(function (response) {
				if(response.valid) {
					$state.go('user.questionlist');
				}
			}, function (response) {
				console.log(response);
			});
		}
	};


	/**
	*	Poziva funkciju za upload iz uploadFile servisa
	*	i dodaje image file za pitanje.
	* 	dodati sljedecu liniju kao atribut na input elementu:
	*	onchange="angular.element(this).scope().onClickUpload(this)"
	*/
	$scope.onClickUpload = function(element) {
		console.log("DAV");
   		uploadFile.upload(element, function(image) {
   			$scope.newQuestion.image = image;
   			$scope.$apply();
   		})
	};
};
