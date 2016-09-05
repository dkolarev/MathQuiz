//modalService.js

function modalService($uibModal, questionResource) {
	return {
		questionInfoModal: function(questionId) {
			return $uibModal.open({
					animation: true,
					templateUrl: 'templates/question/questionInfoModal.html',
					size: 'lg',
					resolve: {
						data: function(questionResource) {
							return questionResource.getQuestionById(questionId).$promise;
						}
					},
					controller: 'questionInfoModalController'
			});
		},

		deleteQuestionModal: function(question) {
			return $uibModal.open({
					animation: true,
					templateUrl: 'templates/question/deleteQuestionModal.html',
					size: 'sm',
					resolve: {
						question: function() {
							return question;
						}
					},
					controller: 'deleteQuestionModalController'
			});
		},

		deleteQuizModal: function(quiz) {
			return $uibModal.open({
					animation: true,
					templateUrl: 'templates/quiz/deleteQuizModal.html',
					size: 'sm',
					resolve: {
						quiz: function() {
							return quiz;
						}
					},
					controller: 'deleteQuizModalController'
			});
		},

		correctAnswerModal: function(correctAnswer) {
			return $uibModal.open({
					animation: true,
					keyboard: false,
					templateUrl: 'templates/player/correctAnswerModal.html',
					size: 'lg',
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