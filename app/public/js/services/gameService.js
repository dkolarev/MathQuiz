//gameService.js

function gameService ($window, $resource) {

	/**
	*	Validira gameId koji je unio korisnik.
	*/
	var verifyGameId = function() {
		var gameId = getGameId();
		return $resource('/game').get();
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

	/**
	*	Vraca gameId iz localStorage-a.
	*/
	var getGameId = function() {
		return $window.localStorage.gameId;
	};

	return {
		verifyGameId: verifyGameId,
		saveGameId: saveGameId,
		getGameId: getGameId,
		deleteGameId: deleteGameId
	}
};