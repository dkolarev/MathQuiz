//ratingCalculatorTest.js

var assert = require('assert');
var ratingCalculator = require('../app/scripts/ratingCalculator');

var old_rating_1 = 4;
var old_rating_count_1 = 1;
var new_rating_1 = 2;

var old_rating_2 = 5;
var old_rating_count_2 = 1;
var new_rating_2 = 1;

var old_rating_3 = Math.round((5 + 4 + 4 + 3 + 4 + 5 + 3 + 5 + 5 + 2 + 3 + 5 + 5 + 5)/14);
var old_rating_count_3 = 14;
var new_rating_3 = 2;

var old_rating_4 = Math.round((1 + 2 + 2 + 3 + 1 + 2)/6);
var old_rating_count_4 = 6;
var new_rating_4 = 3;

describe('ratingCalculator', function() {
	describe('#ratingCalculator(rating_1)', function() {
		it('should return valid result', function() {
			assert.equal(3, ratingCalculator.calculateRating(old_rating_1, old_rating_count_1, new_rating_1));
		});
	});

	describe('#ratingCalculator(rating_2)', function() {
		it('#should return valid result', function() {
			assert.equal(3, ratingCalculator.calculateRating(old_rating_2, old_rating_count_2, new_rating_2));
		});
	});

	describe('#ratingCalculator(rating_3)', function() {
		it('should return valid result', function() {
			assert.equal(4, ratingCalculator.calculateRating(old_rating_3, old_rating_count_3, new_rating_3));
		});
	});

	describe('#ratingCalculator(rating_4)', function() {
		it('should return valid result', function() {
			assert.equal(2, ratingCalculator.calculateRating(old_rating_4, old_rating_count_4, new_rating_4));
		});
	});
});