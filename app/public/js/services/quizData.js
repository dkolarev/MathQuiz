//quizData.js

function quizData($resource) {
	return {
		getQuizById: function(quizId) {
			return $resource('/api/quiz/:quizId', {quizId: '@quizId'})
				.get({quizId: quizId});
		},

		getQuizWithQuestions: function(quizId) {
			return $resource('/api/quiz/details/:quizId', {quizId: '@quizId'})
				.get({quizId: quizId});
		},

		getQuizzes: function() {
			return $resource('/api/quiz/all')
				.get();
		},

		getQuizzesList: function(itemsPerPage = 10, pageNumber = 1) {
			return $resource('/api/quiz/list/:itemsPerPage/:pageNumber', 
					{itemsPerPage: '@itemsPerPage', pageNumber: '@pageNumber'})
						.get({itemsPerPage: itemsPerPage, pageNumber: pageNumber});
		},

		saveQuiz: function(quiz) {
			return $resource('/api/quiz/save')
				.save(quiz);
		},

		deleteQuiz: function(quizId) {
			return $resource('/api/quiz/delete/:quizId', {quizId: '@quizId'})
				.get({quizId: quizId});
		},

		startQuiz: function(quizId) {
			return $resource('/api/quiz/start/:quizId', {quizId: '@quizId'})
				.get({quizId: quizId});
		},

		playQuiz: function(gameId) {
			return $resource('/api/quiz/play/:gameId', {gameId: '@gameId'})
				.get({gameId: gameId});
		}
	};
}