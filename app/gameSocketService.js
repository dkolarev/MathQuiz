//gameSocketService.js

var gameMapper = require('./mappers/gameMapper');

var socketio;

var setSocket = function(io) {
	socketio = io;
};


/**
*	Funkcija kroz socket salje igracima zadatak
*	za rjesavanje. Salju se id zadatka, naziv,
*	tekst i odgovori (bez tocnog odgovora). Dodatno
*	se jos salje pocetno vrijeme potrebno za zadatak.
*/
var emitQuestion = function(gameSocket, question) {
	gameSocket.emit('question', {
		question: {
			questionId: question._id,
			questionTitle: question.title,
			questionDescription: question.description,
			questionAllAnswers: question.allAnswers
		},
		time: question.time
	});
};

var emitDashboardData = function(game) {
	var dashboardItem = gameMapper.gameToDashboardItem(game);
	
	socketio.emit('dashboardUpdate', {
		item: dashboardItem
	});
};

/**
*	Funkcija kroz socket emitira preostalo
*	vrijeme za odredeni zadatak. Ako je vrijeme
*	isteklo pokreni sljedeci zadatak.
*/
var emitTimer = function(gameSocket, time, quiz) {
	return setInterval(function() {
			if (time == 0) {
				questionTransition(gameSocket, quiz);
				clearInterval(this);
			} else {
				time--;
				gameSocket.emit('timer', {
					timer: time
				});
			
			}
		}, 1000);
};

var emitScoreboard = function(gameSocket, teams) {
	var scoreboard = gameMapper.teamListToScoreboardData(teams);

	gameSocket.emit('scoreboard', {
		scoreboard: scoreboard
	});
};

/**
*	Funkcija kroz socket salje igracima
*	da pocinje kviz.
*/
var emitGameStart = function(gameSocket) {
	gameSocket.emit('gameStatus', {
		status: 'start'
	});
};

var emitCorrectAnswer = function(gameSocket, answer) {
	gameSocket.emit('correctAnswer', {
		correctAnswer: answer
	});
};

var emitGameEnd = function(gameSocket) {
	gameSocket.emit('gameStatus', {
		status: 'end'
	});
};

var emitRemoveDashboardElement = function(game) {
	socketio.emit('removeDashboardElement', {
		gameId: game.gameId
	});
};

var emitGameStatus = function(gameSocket) {
	gameSocket.emit('gameStatus', {
		status: 'close'
	});
};

var emitNewTeam = function(gameSocket, teamId, teamName) {
	gameSocket.emit('newTeam', {
		id: teamId,
		name: teamName
	});
}

module.exports = {
	setSocket: setSocket,
	emitQuestion: emitQuestion,
	emitDashboardData: emitDashboardData,
	emitTimer: emitTimer,
	emitScoreboard: emitScoreboard,
	emitGameStart: emitGameStart,
	emitCorrectAnswer: emitCorrectAnswer,
	emitGameEnd: emitGameEnd,
	emitRemoveDashboardElement: emitRemoveDashboardElement,
	emitGameStatus: emitGameStatus,
	emitNewTeam: emitNewTeam
};