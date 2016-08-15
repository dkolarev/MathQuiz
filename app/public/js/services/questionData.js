//questionData.js

function questionData($resource) {
	return {
		saveQuestion: function(question) {
			return $resource('/api/question/save')
					.save(question);
		},

		getQuestions: function() {
			return $resource('/api/question/all')
					.get();
		},

		getQuestionsList: function(itemsPerPage = 10, pageNumber = 1) {
			return $resource('/api/question/list/:itemsPerPage/:pageNumber', 
					{itemsPerPage: '@itemsPerPage', pageNumber: '@pageNumber'})
						.get({itemsPerPage: itemsPerPage, pageNumber: pageNumber});
		},

		getQuestionById: function(questionId) {
			return $resource('/api/question/:questionId', {questionId: '@questionId'})
					.get({questionId: questionId});
		},

		deleteQuestion: function(questionId) {
			return $resource('/api/question/delete/:questionId', {questionId: '@questionId'})
					.get({questionId: questionId});
		},
	};
}