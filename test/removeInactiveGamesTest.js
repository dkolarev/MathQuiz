//removeInactiveGamesTest.js

var assert = require('assert');
var removeInactiveGames = require('../app/data/activeGamesCollection').removeInactiveGames;

var ActiveQuizzes = [
	{name: "Kviz 1", started: '2011-04-11'},
	{name: "Kviz 2", started: '2012-07-14'},
	{name: "Kviz_3", started: '2016-08-17'},
	{name: "Kviz_4", started: '2016-08-17'},
	{name: "Kviz_5", started: '2016-08-16'},
	{name: "Kviz_6", started: '2016-08-16'}
];

describe('removeInactiveGames', function() {
	describe('#removeInactiveGames()', function() {
		it('should return 2 quizzes in list', function() {
			removeInactiveGames();
			var afterRemoveLength = ActiveQuizzes.length;
			assert.equal(2, afterRemoveLength);
		});
	});
});