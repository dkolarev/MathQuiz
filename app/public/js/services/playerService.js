//playerService.js

function playerService ($resource) {

	var saveTeam = function(team) {
		return $resource('/game/saveteam').save(team);
	};

	return {
		saveTeam: saveTeam
	}
};