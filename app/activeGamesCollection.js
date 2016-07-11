//activeGamesCollection.js

var dbapi = require('./dbapi').api();

/**
*	ActiveQuizzes sadrzi aktivan kviz. Kviz je modeliran
*	na sljedecin nacin:
		{
			gameId: kljuc za tu sesiju, preko njega svaki
					igrac moze identificirati igru
			quiz: podaci iz o kvizu iz baze
			questions: listu sa pitanjima za kviz
			gameSocket: socket namespace za komunikaciju s igracima
			currentQuestionPointer: broj koji pokazuje koje je trenutno
									pitanje aktivno
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

module.exports =  {
	/**
	*	Funkcija aktivira kviz, tj. stavlja kviz u listu
	*	sa aktivnim kvizovima koji su za igru.
	*/
	activateQuiz: function(quiz) {
		ActiveQuizzes.push(quiz);
	},

	verifyGameId: function(gameId) {
		var quiz = ActiveQuizzes.filter(function(quiz) {
				 		return quiz.gameId == gameId;
					});

		if (quiz.length > 0) {
			return true;
		} else {
			return false;
		}
	},

	getQuiz: function(gameId) {
		for (var quiz of ActiveQuizzes) {
			if (quiz.gameId == gameId) {
				return quiz;	
			}
		}

		return null;	// ako smo dosli ovako daleko kviz nije pronadjen
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
	}
};