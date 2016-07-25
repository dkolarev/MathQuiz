//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/game/saveteam').save(team);
	};

	var sendAnswer = function(data) {
		return $resource('/game/sendanswer').save(data);
	};

	var sendRating = function(rating) {
		return $resource('/game/sendrating').save(rating);
	}

	return {
		saveTeam: saveTeam,
		sendAnswer: sendAnswer,
		sendRating: sendRating
	}
};