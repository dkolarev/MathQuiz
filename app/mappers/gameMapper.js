//gameMapper.js

var gameToDashboardItem = function(game) {
	var questionsNumber = game.questions.length;
	var currentQuestion;
	if (game.gameStatus === 'waiting for players') {
		currentQuestion = 0;
	} else if (game.gameStatus === 'ended'){
		currentQuestion = game.currentQuestionPointer;
	} else {
		currentQuestion = game.currentQuestionPointer + 1;
	}
	return {
		"gameId": game.gameId,
		"title": game.title,
		"questionsNumber": questionsNumber,
		"currentQuestion": currentQuestion,
		"started": game.started,
		"startedBy": game.startedBy,
		"gameStatus": game.gameStatus
	};
}

var gameListToDashboard = function(gameList) {
	var dashboard = [];

	for (var game of gameList) {
		dashboard.push(gameToDashboardItem(game));
	}

	return dashboard;
}

module.exports = {
	gameToDashboardItem: gameToDashboardItem,
	gameListToDashboard: gameListToDashboard
};