//quizDataRepository.js

function quizDataRepository($resource) {
	return {
		getQuizById: function(quizId) {
			return $resource('/api/quiz/:quizId', {quizId: '@quizId'}).get({quizId: quizId});
		},

		getQuizWithQuestions: function(quizId) {
			return $resource('/api/fullquiz/:quizId', {quizId: '@quizId'}).get({quizId: quizId});
		},

		getQuizzes: function() {
			return $resource('/api/quizzes').get();
		},

		saveQuiz: function(quiz) {
			return $resource('/api/savequiz').save(quiz);
		},

		deleteQuiz: function(quizId) {
			return $resource('/api/deletequiz/:quizId', {quizId: '@quizId'}).get({quizId: quizId});
		},

		startQuiz: function(quizId) {
			return $resource('/api/startquiz/:quizId', {quizId: '@quizId'}).get({quizId: quizId});
		},

		playQuiz: function(gameId) {
			return $resource('/api/playquiz/:gameId', {gameId: '@gameId'}).get({gameId: gameId});
		}
	};
}