//questionDataRepository.js

function questionDataRepository($resource) {
	return {
		saveQuestion: function(question) {
			return $resource('/api/savequestion').save(question);
		},

		getQuestions: function() {
			return $resource('/api/questions').get();
		},

		getQuestionById: function(questionId) {
			return $resource('/api/question/:questionId', {questionId: '@questionId'}).get({questionId: questionId});
		},

		deleteQuestion: function(questionId) {
			return $resource('/api/deletequestion/:questionId', {questionId: '@questionId'}).get({questionId: questionId});
		},
	};
}