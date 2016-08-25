//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/api/game/saveteam').save(team);
	};

	var getQuiz = function() {
		return $resource('/api/game/quiz').get();
	};

	var sendAnswer = function(data) {
		return $resource('/api/game/sendanswer').save(data);
	};

	var sendRating = function(rating) {
		return $resource('/api/game/rating').save(rating);
	};

	var getWinnerData = function() {
		return $resource('/api/game/winnerdata').get();
	};

	return {
		saveTeam: saveTeam,
		getQuiz: getQuiz,
		sendAnswer: sendAnswer,
		sendRating: sendRating,
		getWinnerData: getWinnerData
	}
};