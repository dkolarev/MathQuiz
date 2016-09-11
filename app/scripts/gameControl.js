//gameControl.js

var activeGamesCollection = require('../data/game/activeGamesCollection');
var quizDataRepository = require('../data/quiz/quizDataRepository').dataRepository;
var gameMapper = require('../mappers/gameMapper');
var ratingCalculator = require('./ratingCalculator');
var gameStatusEnum = require('../data/game/gameStatusEnum');
var gameSocketService = require('./gameSocketService');
var gameTimeConstant = require('../data/game/gameTimeConstant');

var iterateQuizQuestions = function(gameSocket, quiz) {
	if(quiz.currentQuestionPointer == quiz.questions.length) {
		endGame(gameSocket, quiz);
		return;
	}

	activeGamesCollection.resetAnswersRecieved(quiz.gameId);

	question = quiz.questions[quiz.currentQuestionPointer];
	question.time = question.time * 60; //pretvori min u sec
	gameSocketService.emitQuestion(gameSocket, question);

	gameSocketService.emitDashboardData(quiz);

	var timer = emitTimer(gameSocket, question.time, quiz);
	activeGamesCollection.setTimer(timer, quiz.gameId);
};

/**
*	Funkcija pokrece postupak za zavrsavanje igre.
	- postavlja status igre na 'ended'
	- update-a status igracima i administratoru
	- pokrece postupak za brisanje igre iz liste
	  aktivnih igara.
*/
var endGame = function(gameSocket, game) {
	setEndStatus(game);
	gameSocketService.emitGameEnd(gameSocket);
	gameSocketService.emitDashboardData(game);
	startGameDeleteProcess(gameSocket, game);
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

/**
*	Provjeri koliko je igraca odgovorilo na pitanje.
*	Ako su svi igraci odgovorili, prijedji na novo pitanje.
*/	
var checkAnsweredCounter = function(gameId) {
	var quiz = activeGamesCollection.getQuiz(gameId);
	var answersRecieved = quiz.answersRecieved;

	if (answersRecieved == quiz.teams.length) {
		activeGamesCollection.clearTimerInterval(gameId);
		
		questionTransition(quiz.gameSocket, quiz);
	}
};


//dohvati pobijednika
var extractWinner = function(scoreboard) {
	return scoreboard.reduce(function(prev, current) {
    			return (prev.pointsSum > current.pointsSum) ? prev : current
			});
};

/**
*	Zapocni proces brisanja igre. Nakon odredjenog vremena
*	posalji status o brisanju administratorima i igracima
*	te nakon toga obrisi igru.
*/
var startGameDeleteProcess = function(gameSocket, game) {
	setTimeout(function(){
		gameSocketService.emitRemoveDashboardElement(game.gameId); //emit admin update
		gameSocketService.emitGameClose(gameSocket);	//emit player update

		activeGamesCollection.removeGame(game.gameId);
		
		activeGamesCollection.removeInactiveGames();
	}, gameTimeConstant.deleteGameTimeout);
};

/**
*	Promijeni sljedece pitanje. Prije toga emitiraj igracima
*	tocan odgovor trenutnog pitanja.
*/
var questionTransition = function(gameSocket, quiz) {
	var question = quiz.questions[quiz.currentQuestionPointer];
	gameSocketService.emitCorrectAnswer(gameSocket, question.correctAnswer);

	setTimeout(function() {
		activeGamesCollection.iterateCurrentQuestion(quiz.gameId);
		iterateQuizQuestions(gameSocket, quiz);

		clearTimeout(this);
	}, gameTimeConstant.questionTransition);
};

var setPlayStatus = function(quiz) {
	quiz.gameStatus = gameStatusEnum.activeStatus;
};

var setEndStatus = function(quiz) {
	quiz.gameStatus = gameStatusEnum.endStatus;
};


module.exports = {
	play: function(gameId, scoringMethod) {
		var quiz = activeGamesCollection.getQuiz(gameId);
		if (quiz == null) {
			return;
		} else {
			quiz.currentQuestionPointer = 0;
			quiz.scoringMethod = scoringMethod;

			gameSocketService.emitGameStart(quiz.gameSocket);
			iterateQuizQuestions(quiz.gameSocket, quiz);
			gameSocketService.emitScoreboard(quiz.gameSocket, quiz.teams);
			setPlayStatus(quiz);
		}
	},

	validateAnswer: function(answer, gameId, questionId, teamId, answerTime) {
		var result = activeGamesCollection.validateAnswer(answer, gameId, questionId, answerTime);

		activeGamesCollection.storeAnswer(gameId, teamId, questionId, answer, result.correct, result.points,
										 	function(gameSocket, teams) {
												gameSocketService.emitScoreboard(gameSocket, teams);
										 });

		return result.correct;

	},

	iterateAnsweredCounter: function(gameId) {
		activeGamesCollection.iterateAnswersRecieved(gameId);
		checkAnsweredCounter(gameId);
	},

	getWinnerData: function(gameId) {
		var quiz = activeGamesCollection.getQuiz(gameId);
		if(quiz.teams.length !== 0) {
			var scoreboard = gameMapper.teamListToScoreboardData(quiz.teams);
			var winner = extractWinner(scoreboard);
		}
		return {
			"scoreboard": scoreboard,
			"winner": winner
		};
	},

	rateQuiz: function(gameId, rating) {
		var quiz = activeGamesCollection.getQuiz(gameId);

		quizDataRepository.getQuiz(quiz._id).then(function(dbQuiz) {
			var newRatingCount = dbQuiz.ratingCount + 1;
			var newRating = ratingCalculator.calculateRating(dbQuiz.rating, dbQuiz.ratingCount, rating);

			quizDataRepository.updateQuizRating(dbQuiz._id, newRatingCount, newRating);
		});
	},

	deleteGame: function(gameId, gameSocket) {
		gameSocketService.emitRemoveDashboardElement(gameId); //emit admin update
		gameSocketService.emitGameClose(gameSocket);	//emit player update

		activeGamesCollection.removeGame(gameId);		
	}
};