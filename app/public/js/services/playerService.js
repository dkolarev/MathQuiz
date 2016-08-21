//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/api/game/saveteam').save(team);
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
		sendAnswer: sendAnswer,
		sendRating: sendRating,
		getWinnerData: getWinnerData
	}
};