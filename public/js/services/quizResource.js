//quizResource.js

function quizResource($resource) {
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

		getQuizzesList: function(itemsPerPage = 4, pageNumber = 1) {
			return $resource('/api/quiz/list/:itemsPerPage/:pageNumber', 
					{itemsPerPage: '@itemsPerPage', pageNumber: '@pageNumber'})
						.get({itemsPerPage: itemsPerPage, pageNumber: pageNumber});
		},

		getFilteredList: function(filter) {
			return $resource('/api/quiz/list/filter')
				.save(filter);
		},

		saveQuiz: function(quiz) {
			return $resource('/api/quiz/save')
				.save(quiz);
		},

		editQuiz: function(quizId, quiz) {
			return $resource('/api/quiz/edit/:quizId', null, {
				'update': {method: 'PUT'}
			}).update({quizId: quizId}, quiz);
		},

		deleteQuiz: function(quizId) {
			return $resource('/api/quiz/delete/:quizId', {quizId: '@quizId'})
				.delete({quizId: quizId});
		},

		startQuiz: function(data) {
			return $resource('/api/quiz/start')
				.save(data);
		},

		playQuiz: function(data) {
			return $resource('/api/quiz/play')
				.save(data);
		},

		dissolveGame: function(gameId) {
			return $resource('/api/quiz/dissolve/:gameId', {gameId: '@gameId'})
				.delete({gameId: gameId});
		}
	};
}