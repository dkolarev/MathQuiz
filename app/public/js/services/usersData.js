///usersData.js

function usersData($resource) {
	return {
		saveQuestion: function(question) {
			return $resource('/api/savequestion').save(question);
		},

		getQuestions: function() {
			return $resource('/api/questions').get();
		},

		deleteQuestion: function(questionId) {
			return $resource('/api/deletequestion/:questionId', {questionId: '@questionId'}).get({questionId: questionId});
		},

		saveQuiz: function(quiz) {
			return $resource('/api/savequiz').save(quiz);
		}
	};
};