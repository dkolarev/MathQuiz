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


//kolekcija s aktivnim igrama (kvizovima)
var ActiveQuizzes = [];


// ==================================================
//	Metode za dodjelu bodova ========================
//===================================================

//zaokruzuje broj na dvije decimale
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

//dodijeljuje bodove na osnovu tezine.
var assignPointsByDifficulty = function(questionDifficulty) {
	if (questionDifficulty === questionDifficultyEnum.easy) {
		return gamePointsEnum.easy;
	} else if (questionDifficulty === questionDifficultyEnum.intermediate) {
		return gamePointsEnum.intermediate;
	} else if (questionDifficulty === questionDifficultyEnum.hard) {
		return gamePointsEnum.hard;
	}
};

/**
*	Dodijeljuje bodove na osnovu odgovorenog vremena po formuli:
*			tezina * odgovoreno_vrijeme/ukupno_vrijeme
*/
var assignPointsByTime = function(questionDifficulty, overallTime, answerTime) {
	if (questionDifficulty === questionDifficultyEnum.easy) {
		return roundToTwo(gamePointsEnum.easy*answerTime/overallTime);
	} else if (questionDifficulty === questionDifficultyEnum.intermediate) {
		return roundToTwo(gamePointsEnum.intermediate*answerTime/overallTime);
	} else if (questionDifficulty === questionDifficultyEnum.hard) {
		return roundToTwo(gamePointsEnum.hard*answerTime/overallTime);
	}
};	



/**
*	Funkcija aktivira kviz, tj. stavlja kviz u listu
*	sa aktivnim kvizovima koji su za igru.
*/
var activateQuiz = function(quiz) {
	ActiveQuizzes.push(quiz);
};

/**
*	Funkcija za uneseni gameId pronalazi quiz sa tim id-om
*	i vraca true ako takav kviz postoji medu aktivnim kvizovima, 
*	u suprotnom vraca false.
*/
var verifyGameId = function(gameId) {
	//filter vraca listu objekata
	var quiz = ActiveQuizzes.filter(function(quiz) {
				 	return quiz.gameId == gameId;
	});

	if (quiz.length > 0) {
		return true;
	} else {
		return false;
	}
};

/**
*	Funkcija pronalazi kviz medu aktivnim kvizovima.
*	Ako takav kviz postoji vraca, u suprotnom vraca null.
*/
var getQuiz = function(gameId) {
	for (var quiz of ActiveQuizzes) {
		if (quiz.gameId == gameId) {
			return quiz;	
		}
	}

	return null;	// ako smo dosli ovako daleko kviz nije pronadjen
};


//Vraca sve aktivne kvizove.
var getAllGames = function() {
	return ActiveQuizzes;
};

/**
*	Ubacuje tim u odgovarajucu igru i dodijeljuje
*	mu id.
*/
var insertTeam = function(team, gameId, callb) {
	var teamId;
	var quiz = getQuiz(gameId);
	if (quiz) {
		teamId = quiz.teams.length + 1;
		team.teamId = teamId;
		quiz.teams.push(team);

		callb(teamId);
	} else {
		return;
	}
};

// Validira uneseni odgovor tima i dodijeljuje bodove.
var validateAnswer = function(answer, gameId, questionId, answerTime) {
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
};

//sprema odgovor tima u kolekciju.
var storeAnswer = function(gameId, teamId, questionId, answer, success, points, callb) {
	var quiz = getQuiz(gameId);
	
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
};

//dohvaca trenutno aktivno pitanje u igri.
var getActiveQuestion = function(gameId) {
	var quiz = getQuiz(gameId);
	return quiz.questions[quiz.currentQuestionPointer];
};

var iterateCurrentQuestion = function(gameId) {
	var quiz = getQuiz(gameId);
	quiz.currentQuestionPointer++;
};

var setTimer = function(timer, gameId) {
	var quiz = getQuiz(gameId);
	quiz.timer = timer;
};

var iterateAnswersRecieved = function(gameId) {
	var quiz = getQuiz(gameId);
	quiz.answersRecieved++;
};

var clearTimerInterval = function(gameId) {
	var quiz = getQuiz(gameId);
	clearInterval(quiz.timer);
};

var resetAnswersRecieved = function(gameId) {
	var quiz = getQuiz(gameId);
	quiz.answersRecieved = 0;
};

/**
*	Brise igru iz kolekcije nakon sto je igra zavrsila
*	ili ako kreator igre to zatrazi.
*/
var removeGame = function(gameId) {
	for(var index in ActiveQuizzes) {
		if (ActiveQuizzes[index].gameId == gameId) {
			ActiveQuizzes.splice(index, 1);
			return;
		}
	}
};

/**
*	Provjera sve starije igre i brise
*	one koje su starije od jednog dana.
*/
var removeInactiveGames = function() {
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
};

var getGameSocket = function(gameId) {
	var quiz = getQuiz(gameId);

	return quiz.gameSocket;
};

var getTeamAnswer = function(gameId, teamId, questionId) {
	var quiz = getQuiz(gameId);
	for (var team of quiz.teams) {
		if (team.teamId == teamId) {
			for (var answer of team.answers) {
				if (answer.questionId == questionId) {
					return {
						"answer": answer.answer,
						"success": answer.success,
						"points": answer.points
					};
				}
			}
		}
	}

	return;
}; 


module.exports =  {
	activateQuiz: activateQuiz,
	verifyGameId: verifyGameId,
	getQuiz: getQuiz,
	getAllGames: getAllGames,
	insertTeam: insertTeam,
	validateAnswer: validateAnswer,
	storeAnswer: storeAnswer,
	getActiveQuestion: getActiveQuestion,
	iterateCurrentQuestion: iterateCurrentQuestion,
	setTimer: setTimer,
	iterateAnswersRecieved: iterateAnswersRecieved,
	clearTimerInterval: clearTimerInterval,
	resetAnswersRecieved: resetAnswersRecieved,
	removeGame: removeGame,
	removeInactiveGames: removeInactiveGames,
	getGameSocket: getGameSocket,
	getTeamAnswer: getTeamAnswer
};

