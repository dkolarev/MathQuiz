//activeGamesCollection.js

var gamePointsEnum = require('./gamePointsEnum');
var questionDifficultyEnum = require('../question/questionDifficultyEnum');

/**
*	ActiveQuizzes sadrzi aktivan kviz. Kviz je modeliran
*	na sljedecin nacin:
		{
			gameId: kljuc za tu sesiju, preko njega svaki
					igrac moze identificirati igru
			quiz: podaci iz o kvizu iz baze
			questions: listu sa pitanjima za kviz
			timer: timer za trenutno pitanje
			answersRecieved: broji koliko je timova odgovorilo na trenutno pitanje
			gameSocket: socket namespace za komunikaciju s igracima
			currentQuestionPointer: broj koji pokazuje koje je trenutno
									pitanje aktivno
			gameStatus: trenutni status igre
			scoringMethod: ['difficulty', 'time'] metoda kojom se obracunavaju
							bodovi
			startedBy: ime igraca koji je pokrenio igru
			started: datum kada je igra pokrenuta
			teams: {
				teamId: identifikacijski kljuc za
						svaki tim koji sudjeluje u igri
				name: ime tima
				players: sadrzi listu igraca svakog
						 u timu
				answers: {
					questionId: id zadatka na koji je
								tim dao odgovor
					answer: odgovor koji je dao tim
					success: flag je li tim dao tocan
						     odgovor
					points: broj bodova koje je tim
							dobio za taj zadatak
				}
				pointsSum: suma svih bodova koje je
						   tim ostvario u danom trenutku
			}
		}
*/


var ActiveQuizzes = [];


var getQuiz = function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				return quiz;	
			}
		}

		return null;	// ako smo dosli ovako daleko kviz nije pronadjen
};

var roundToTwo = function(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
};

var asignPoints = function(questionDifficulty, scoringMethod, overallTime, answerTime) {
	if(scoringMethod === 'difficulty') {
		return assignPointsByDifficulty(questionDifficulty);
	} else {
		return assignPointsByTime(questionDifficulty, overallTime, answerTime);	
	}
};

var assignPointsByDifficulty = function(questionDifficulty) {
	if (questionDifficulty === questionDifficultyEnum.easy) {
		return gamePointsEnum.easy;
	} else if (questionDifficulty === questionDifficultyEnum.intermediate) {
		return gamePointsEnum.intermediate;
	} else if (questionDifficulty === questionDifficultyEnum.hard) {
		return gamePointsEnum.hard;
	}
};

var assignPointsByTime = function(questionDifficulty, overallTime, answerTime) {
	if (questionDifficulty === questionDifficultyEnum.easy) {
		return roundToTwo(gamePointsEnum.easy*answerTime/overallTime);
	} else if (questionDifficulty === questionDifficultyEnum.intermediate) {
		return roundToTwo(gamePointsEnum.intermediate*answerTime/overallTime);
	} else if (questionDifficulty === questionDifficultyEnum.hard) {
		return roundToTwo(gamePointsEnum.hard*answerTime/overallTime);
	}
};	

module.exports =  {
	/**
	*	Funkcija aktivira kviz, tj. stavlja kviz u listu
	*	sa aktivnim kvizovima koji su za igru.
	*/
	activateQuiz: function(quiz) {
		ActiveQuizzes.push(quiz);
	},

	/**
	*	Funkcija za uneseni gameId pronalazi quiz sa tim id-om
	*	i vraca true ako takav kviz postoji medu aktivnim kvizovima, 
	*	u suprotnom vraca false.
	*/
	verifyGameId: function(gameId) {
		//filter vraca listu objekata
		var quiz = ActiveQuizzes.filter(function(quiz) {
				 		return quiz.gameId == gameId;
					});

		if (quiz.length > 0) {
			return true;
		} else {
			return false;
		}
	},

	/**
	*	Funkcija pronalazi kviz medu aktivnim kvizovima.
	*	Ako takav kviz postoji vraca, u suprotnom vraca null.
	*/
	getQuiz: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				return quiz;	
			}
		}

		return null;	// ako smo dosli ovako daleko kviz nije pronadjen
	},

	getAllGames: function() {
		return ActiveQuizzes;
	},

	insertTeam: function(team, gameId, callb) {
		var teamId;
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				teamId = quiz.teams.length + 1;
				team.teamId = teamId;
				quiz.teams.push(team);
				break;
			}
		}

		callb(teamId);
	},

	validateAnswer: function(answer, gameId, questionId, answerTime) {
		var quiz = getQuiz(gameId);
			for (var question of quiz.questions) {
				if (question._id == questionId) {
					if (answer == question.correctAnswer) {
						var points = asignPoints(question.difficulty, quiz.scoringMethod, question.time, answerTime);
							return {
								correct: true,
								points: points
							};
						} else {
							return {
								correct: false,
								points: 0
							};
						}	
				}
			}
	},

	storeAnswer: function(gameId, teamId, questionId, answer, success, points, callb) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				for (var team of quiz.teams) {
					if (team.teamId == teamId) {
						team.answers.push({
							questionId: questionId,
							answer: answer,
							success: success,
							points: points
						});
						team.pointsSum = roundToTwo(team.pointsSum + points);

						break;
					}
				}

				callb(quiz.gameSocket, quiz.teams);

				return;
			}
		}
	},

	getActiveQuestion: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				return quiz.questions[quiz.currentQuestionPointer];
			}
		}
	},

	iterateCurrentQuestion: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				quiz.currentQuestionPointer++;
				break;
			}
		}
	},

	setTimer: function(timer, gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				quiz.timer = timer;
				break;
			}
		}
	},

	iterateAnswersRecieved: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				quiz.answersRecieved++;
				break;
			}
		}
	},

	clearTimerInterval: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				clearInterval(quiz.timer);
				break;
			}
		}
	},

	resetAnswersRecieved: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				quiz.answersRecieved = 0;
				break;
			}
		}
	},

	removeGame: function(gameId) {
		for(var index in ActiveQuizzes) {
			if (ActiveQuizzes[index].gameId == gameId) {
				ActiveQuizzes.splice(index, 1);
				return;
			}
		}
	},

	removeInactiveGames: function() {
		var currentTime = new Date();
		var oneDay=1000*60*60*24;
		
		var lengthArray = ActiveQuizzes.length;
		for (var i = lengthArray - 1; i >= 0; i--) {
			var game = ActiveQuizzes[i];
			var startedTime = new Date(game.started);
			var difference = currentTime - startedTime;
			if (difference >= oneDay) {
				removeGame(game);
			}
		}
	},

	getGameSocket: function(gameId) {
		var quiz = getQuiz(gameId);

		return quiz.gameSocket;
	}
};

