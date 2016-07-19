//gameControl.js

var activeGamesCollection = require('./activeGamesCollection');

var iterateQuizQuestions = function(gameSocket, quiz) {
	if(quiz.currentQuestionPointer == quiz.questions.length) {
		return;
	}

	question = quiz.questions[quiz.currentQuestionPointer];
	question.time = question.time; //pretvori min u sec
	emitQuestion(gameSocket, question);
	emitTimer(gameSocket, question.time, quiz);

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

/**
*	Funkcija kroz socket emitira preostalo
*	vrijeme za odredeni zadatak. Ako je vrijeme
*	isteklo pokreni sljedeci zadatak.
*/
var emitTimer = function(gameSocket, time, quiz) {
	setInterval(function() {
		if (time == 0) {
			activeGamesCollection.iterateCurrentQuestion(quiz.gameId);
			quiz.currentQuestionPointer++;
			iterateQuizQuestions(gameSocket, quiz);
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
	var scoreboard = extractScoreboardData(teams);

	gameSocket.emit('scoreboard', {
		scoreboard: scoreboard
	});
};

var extractScoreboardData = function(teams) {
	var scoreboard = [];

	for (var team of teams) {
		scoreboard.push({
			teamName: team.name,
			teamPlayers: team.players,
			teamPoints: team.pointsSum
		});
	}

	return scoreboard; 
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


module.exports = {
	play: function(gameId, socketio) {
		var quiz = activeGamesCollection.getQuiz(gameId);
		if (quiz == null) {
			return;
		} else {
			quiz.currentQuestionPointer = 0;
			emitGameStart(quiz.gameSocket);
			iterateQuizQuestions(quiz.gameSocket, quiz);
			emitScoreboard(quiz.gameSocket, quiz.teams);
		}
	},

	validateAnswer: function(answer, gameId, questionId, teamId) {
		var result = activeGamesCollection.validateAnswer(answer, gameId, questionId);

		activeGamesCollection.storeAnswer(gameId, teamId, questionId, answer, result.correct, result.points,
										 	function(gameSocket, teams) {
												emitScoreboard(gameSocket, teams);
										 });

		return result.correct;

	}

};