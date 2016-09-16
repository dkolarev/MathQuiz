//gameResource.js

function gameResource ($resource) {

	var saveTeam = function(team) {
		return $resource('/api/game/saveteam').save(team);
	};

	var getQuiz = function(gameId) {
		return $resource('/api/game/quiz', {gameId: '@gameId'}).get({gameId: gameId});
	};

	var sendAnswer = function(data) {
		return $resource('/api/game/sendanswer').save(data);
	};

	var sendRating = function(rating) {
		return $resource('/api/game/rating').save(rating);
	};

	var getWinnerData = function(gameId) {
		return $resource('/api/game/winnerdata', {gameId: '@gameId'}).get({gameId: gameId});
	};

	var getSignedTeams = function(gameId) {
		return $resource('/api/game/teams', {gameId: '@gameId'}).get({gameId: gameId});
	};

	var getGameStatus = function() {
		return $resource('/api/game/status').get();
	};

	return {
		saveTeam: saveTeam,
		getQuiz: getQuiz,
		sendAnswer: sendAnswer,
		sendRating: sendRating,
		getWinnerData: getWinnerData,
		getSignedTeams: getSignedTeams,
		getGameStatus: getGameStatus
	}
};