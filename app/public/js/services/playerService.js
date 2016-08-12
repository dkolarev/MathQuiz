//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/game/saveteam').save(team);
	};

	var sendAnswer = function(data) {
		return $resource('/game/sendanswer').save(data);
	};

	var sendRating = function(rating) {
		return $resource('/game/rating').save(rating);
	};

	var getWinnerData = function() {
		return $resource('/game/winnerdata').get();
	};

	return {
		saveTeam: saveTeam,
		sendAnswer: sendAnswer,
		sendRating: sendRating,
		getWinnerData: getWinnerData
	}
};