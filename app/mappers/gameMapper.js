//gameMapper.js

var gameToDashboardItem = function(game) {
	var questionsNumber = game.questions.length;
	return {
		"gameId": game.gameId,
		"title": game.title,
		"questionsNumber": questionsNumber,
		"currentQuestionPointer": game.currentQuestionPointer
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