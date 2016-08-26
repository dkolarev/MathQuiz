//gameControl.js

var activeGamesCollection = require('./data/game/activeGamesCollection');
var quizDataRepository = require('./data/quiz/quizDataRepository').dataRepository;
var gameMapper = require('./mappers/gameMapper');
var ratingCalculator = require('./ratingCalculator');
var gameStatusEnum = require('./data/game/gameStatusEnum');
var gameSocketService = require('./gameSocketService');

var iterateQuizQuestions = function(gameSocket, quiz) {
	if(quiz.currentQuestionPointer == quiz.questions.length) {
		endGame(gameSocket, quiz);
		return;
	}

	activeGamesCollection.resetAnswersRecieved(quiz.gameId);

	question = quiz.questions[quiz.currentQuestionPointer];
	question.time = question.time; //pretvori min u sec
	gameSocketService.emitQuestion(gameSocket, question);

	gameSocketService.emitDashboardData(quiz);

	var timer = gameSocketService.emitTimer(gameSocket, question.time, quiz);
	activeGamesCollection.setTimer(timer, quiz.gameId);
};

var endGame = function(gameSocket, game) {
	setEndStatus(game);
	gameSocketService.emitGameEnd(gameSocket);
	gameSocketService.emitDashboardData(game);
	deleteGame(gameSocket, game);
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

var deleteGame = function(gameSocket, game) {
	setTimeout(function(){
		activeGamesCollection.removeGame(game);
		
		gameSocketService.emitGameEnd(gameSocket);	//emit admit update
		gameSocketService.emitGameStatus(gameSocket);	//emit player update

		activeGamesCollection.removeInactiveGames();
	}, 5000);
};

var questionTransition = function(gameSocket, quiz) {
	var question = quiz.questions[quiz.currentQuestionPointer];
	gameSocketService.emitCorrectAnswer(gameSocket, question.correctAnswer);

	setTimeout(function() {
		activeGamesCollection.iterateCurrentQuestion(quiz.gameId);
		//quiz.currentQuestionPointer++;
		iterateQuizQuestions(gameSocket, quiz);

		clearTimeout(this);
	}, 5000);
};

var setPlayStatus = function(quiz) {
	quiz.gameStatus = gameStatusEnum.activeStatus;
};

var setEndStatus = function(quiz) {
	quiz.gameStatus = gameStatusEnum.endStatus;
};


module.exports = {
	play: function(gameId) {
		var quiz = activeGamesCollection.getQuiz(gameId);
		if (quiz == null) {
			return;
		} else {
			quiz.currentQuestionPointer = 0;
			gameSocketService.emitGameStart(quiz.gameSocket);
			iterateQuizQuestions(quiz.gameSocket, quiz);
			gameSocketService.emitScoreboard(quiz.gameSocket, quiz.teams);
			setPlayStatus(quiz);
		}
	},

	validateAnswer: function(answer, gameId, questionId, teamId) {
		var result = activeGamesCollection.validateAnswer(answer, gameId, questionId);

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
		var scoreboard = gameMapper.teamListToScoreboardData(quiz.teams);
		var winner = extractWinner(scoreboard);

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
	}
};