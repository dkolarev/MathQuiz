//modalService.js

function modalService($uibModal) {
	return {
		questionInfoModal: function(question) {
			return $uibModal.open({
					animation: true,
					templateUrl: 'templates/user/questionInfoModal.html',
					size: 'lg',
					resolve: {
					question: function() {
						return question;
					}
				},
				controller: 'questionInfoModalController'
			});
		},

		deleteQuestionModal: function(question) {
			return $uibModal.open({
					animation: true,
					templateUrl: 'templates/user/deleteQuestionModal.html',
					size: 'sm',
					resolve: {
						question: function() {
							return question;
						}
					},
					controller: 'deleteQuestionModalController'
			});
		},

		correctAnswerModal: function(correctAnswer) {
			return $uibModal.open({
					animation: true,
					keyboard: false,
					templateUrl: 'templates/player/correctAnswerModal.html',
					size: 'sm',
					resolve: {
						correctAnswer: function() {
							return correctAnswer;
						}
					},
					controller: function($scope, correctAnswer) {
						$scope.correctAnswer = correctAnswer;
					}
			});
		}
	}
}