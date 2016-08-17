//activeGamesCollection.js

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


var asignPoints = function(questionDifficulty) {
	if (questionDifficulty == "easy") {
		return 5;
	} else if (questionDifficulty == "intermediate") {
		return 10;
	} else if (questionDifficulty == "hard") {
		return 20;
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
				var index = ActiveQuizzes.indexOf(quiz);
				teamId = quiz.teams.length + 1;
				team.teamId = teamId;
				quiz.teams.push(team);
				ActiveQuizzes[index] = quiz;
				break;
			}
		}

		callb(teamId);
	},

	validateAnswer: function(answer, gameId, questionId) {
		var quiz = getQuiz(gameId);
			for (var question of quiz.questions) {
				if (question._id == questionId) {
					if (answer == question.correctAnswer) {
						var points = asignPoints(question.difficulty);
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
				var index = ActiveQuizzes.indexOf(quiz);

				for (var team of quiz.teams) {
					if (team.teamId == teamId) {
						var teamIndex = quiz.teams.indexOf(team);

						team.answers.push({
							questionId: questionId,
							answer: answer,
							success: success,
							points: points
						});

						team.pointsSum = team.pointsSum + points;

						quiz.teams[teamIndex] = team;
						break;
					}
				}

				ActiveQuizzes[index] = quiz;

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
				var index = ActiveQuizzes.indexOf(quiz);
				quiz.currentQuestionPointer++;
				ActiveQuizzes[index] = quiz;
				break;
			}
		}
	},

	setTimer: function(timer, gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				var index = ActiveQuizzes.indexOf(quiz);
				quiz.timer = timer;
				ActiveQuizzes[index] = quiz;
				break;
			}
		}
	},

	iterateAnswersRecieved: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				var index = ActiveQuizzes.indexOf(quiz);
				quiz.answersRecieved++;
				ActiveQuizzes[index] = quiz;
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
				var index = ActiveQuizzes.indexOf(quiz);
				quiz.answersRecieved = 0;
				ActiveQuizzes[index] = quiz;
				break;
			}
		}
	}
};

