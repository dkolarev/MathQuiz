//teamDataValidator.js

var validateName = function (name) {
	if (typeof name === "undefined") return false;
	if (typeof name !== "string") return false;
	if (name === "") return false;

	return true;
}

var validatePlayers = function(players) {
	if (!Array.isArray(players)) return false;
	if (players.length == 0) return false;
	for (var player of players) {
		if (typeof player.name === "undefined") return false;
		if (typeof player.name !== "string") return false;
		if (player.name === "") return false;
	}

	return true;
}

var validateTeam = function(team) {
	if (!validateName(team.name)) return false;
	if (!validatePlayers(team.players)) return false;

	return true;
}

module.exports = {
	validateName: validateName,
	validatePlayers: validatePlayers,
	validateTeam: validateTeam
};