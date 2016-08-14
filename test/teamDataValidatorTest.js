//teamDataValidatorTest.js

var assert = require('assert');
var validateTeam = require('../app/data/teamDataValidator').validateTeam;

var team_1 = {
	name: "Team1",
	players: [
		{id:1, name: "player1"},
		{id:2, name: "player2"},
		{id:3, name: "player3"},
		{id:4, name: "player4"}
	]
};

var team_2 = {
	name: "",
	players: [{id:1, name: "player1"}]
};

var team_3 = {
	name: "Team1",
	players: []
};

var team_4 = {
	name: "Team1",
	players: "player1"
};

describe('validateTeam', function() {
	describe('#validateTeam(team_1)', function() {
		it('should return true on valid team', function() {
			assert.equal(true, validateTeam(team_1));
		});
	});

	describe('#validateTeam(team_2)', function() {
		it('should return false on invalid team name', function() {
			assert.equal(false, validateTeam(team_2));
		});
	});

	describe('#validateTeam(team_3)', function() {
		it('should return false on empty players list', function() {
			assert.equal(false, validateTeam(team_3));
		});
	});

	describe('#validateTeam(team_4)', function() {
		it('should return false on invalid players list', function() {
			assert.equal(false, validateTeam(team_4));
		});
	});
});

