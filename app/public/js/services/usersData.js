///usersData.js

function usersData($resource) {
	return {
		saveQuestion: function(question) {
			return $resource('/api/savequestion').save(question);
		},

		getQuestions: function() {
			return $resource('/api/questions').get();
		}
	};
}