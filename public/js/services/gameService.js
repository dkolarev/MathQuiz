//gameService.js

function gameService ($window, $resource) {

	/**
	*	Validira gameId koji je unio korisnik.
	*/
	var verifyGameId = function() {
		var gameId = getGameId();
		return $resource('/api/game').get();
	};

	/**
	*	Sprema uneseni gameId u localStorage.
	*/
	var saveGameId = function(gameId) {
		$window.localStorage.gameId = gameId;
	};

	var deleteGameId = function() {
		if ($window.localStorage.gameId) {
			delete $window.localStorage.gameId;
		}
		return;	
	};

	var saveTeamId = function(teamId) {
		$window.localStorage.teamId = teamId;
	};

	var deleteTeamId = function() {
		if ($window.localStorage.teamId) {
			delete $window.localStorage.teamId;
		}
		return;
	};

	var getTeamId = function() {
		return $window.localStorage.teamId;
	}

	/**
	*	Vraca gameId iz localStorage-a.
	*/
	var getGameId = function() {
		return $window.localStorage.gameId;
	};

	var isActive = function() {
		var gameId = getGameId();
		if (gameId) {
			return true;
		} else {
			return false;
		}
	};

	return {
		verifyGameId: verifyGameId,
		saveGameId: saveGameId,
		getGameId: getGameId,
		isActive: isActive,
		deleteGameId: deleteGameId,
		saveTeamId: saveTeamId,
		deleteTeamId: deleteTeamId,
		getTeamId: getTeamId
	}
};