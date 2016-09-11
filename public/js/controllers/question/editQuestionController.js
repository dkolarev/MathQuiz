//editQuestionController.js

function editQuestionController($scope, $state, questionResource, uploadFile, data, enumData) {

	$scope.newQuestion = data.question;

	$scope.selectList = enumData.fieldEnum;

	$scope.onClickSaveQuestion = function (question) {
		if($scope.newQuestionForm.$valid) {
			questionResource.editQuestion(question._id, question).$promise.then(function (response) {
				if(response.valid) {
					$state.go('user.questionlist');
				}
			}, function (response) {
				console.log(response);
			});
		}
	};

	$scope.onClickRemoveImage = function(question) {
		question.image = null;
	};

	/**
	*	Poziva funkciju za upload iz uploadFile servisa
	*	i dodaje image file za pitanje.
	* 	dodati sljedecu liniju kao atribut na input elementu:
	*	onchange="angular.element(this).scope().onClickUpload(this)"
	*/
	$scope.onClickUpload = function(element) {
   		uploadFile.upload(element, function(image) {
   			$scope.newQuestion.image = image;
   			$scope.$apply();
   		})
	};
}