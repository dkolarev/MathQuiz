//gameControl.js

var activeGamesCollection = require('./activeGamesCollection');
var dbapi = require('./dbapi').api();

var iterateQuizQuestions = function(gameSocket, quiz) {
	if(quiz.currentQuestionPointer == quiz.questions.length) {
		emitGameEnd(gameSocket);
		return;
	}

	activeGamesCollection.resetAnswersRecieved(quiz.gameId);

	question = quiz.questions[quiz.currentQuestionPointer];
	question.time = question.time; //pretvori min u sec
	emitQuestion(gameSocket, question);

	var timer = emitTimer(gameSocket, question.time, quiz);
	activeGamesCollection.setTimer(timer, quiz.gameId);
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

var checkAnsweredCounter = function(gameId) {
	var quiz = activeGamesCollection.getQuiz(gameId);
	var answersRecieved = quiz.answersRecieved;

	if (answersRecieved == quiz.teams.length) {
		activeGamesCollection.clearTimerInterval(gameId);
		
		questionTransition(quiz.gameSocket, quiz);
	}
};

var extractWinner = function(scoreboard) {
	return scoreboard.reduce(function(prev, current) {
    			return (prev.pointsSum > current.pointsSum) ? prev : current
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

var questionTransition = function(gameSocket, quiz) {
	var question = quiz.questions[quiz.currentQuestionPointer];
	emitCorrectAnswer(gameSocket, question.correctAnswer);

	setTimeout(function() {
		activeGamesCollection.iterateCurrentQuestion(quiz.gameId);
		//quiz.currentQuestionPointer++;
		iterateQuizQuestions(gameSocket, quiz);

		clearTimeout(this);
	}, 5000);
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

	},

	iterateAnsweredCounter: function(gameId) {
		activeGamesCollection.iterateAnswersRecieved(gameId);
		checkAnsweredCounter(gameId);
	},

	getWinnerData: function(gameId) {
		var quiz = activeGamesCollection.getQuiz(gameId);
		var scoreboard = extractScoreboardData(quiz.teams);
		var winner = extractWinner(scoreboard);

		return {
			"scoreboard": scoreboard,
			"winner": winner
		};
	},

	rateQuiz: function(gameId, rating) {
		var quiz = activeGamesCollection.getQuiz(gameId);

		dbapi.updateQuizRating(quiz._id, rating);
	}
};