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

var questionToPlayerQuestion = function(question) {
	return {
		questionId: question._id,
		questionTitle: question.title,
		questionDescription: question.description,
		questionAllAnswers: question.allAnswers
	};
}

var teamListToScoreboardData = function(teams) {
	var scoreboard = [];

	for (var team of teams) {
		scoreboard.push({
			teamId: team.teamId,
			teamName: team.name,
			teamPlayers: team.players,
			teamPoints: team.pointsSum
		});
	}

	return scoreboard; 
}

var teamListToTeamMetadataList = function(teams) {
	var metadataList = [];
	for (var team of teams) {
		metadataList.push({
			teamId: team.teamId,
			teamName: team.name,
			teamPlayers: team.players
		});
	}

	return metadataList;
}

module.exports = {
	gameToDashboardItem: gameToDashboardItem,
	gameListToDashboard: gameListToDashboard,
	questionToPlayerQuestion: questionToPlayerQuestion,
	teamListToScoreboardData: teamListToScoreboardData,
	teamListToTeamMetadataList: teamListToTeamMetadataList
};