//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/game/saveteam').save(team);
	};

	var sendAnswer = function(data) {
		return $resource('/game/sendanswer').save(data);
	};

	return {
		saveTeam: saveTeam,
		sendAnswer: sendAnswer
	}
};