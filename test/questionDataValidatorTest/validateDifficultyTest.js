//validateDifficultyTest.js

var assert = require('assert');
var validateDifficulty = require('../../app/data/question/questionDataValidator').validateDifficulty;

var difficulty_1 = 'easy';
var difficulty_2 = 'intermediate';
var difficulty_3 = 'hard';
var difficulty_4 = 'medium';
var difficulty_5;
var difficulty_6 = "";
var difficulty_7 = 12345;

describe('validateDifficulty', function() {
	describe('#validateDifficulty(difficulty_1)', function() {
		it('should return true on easy difficulty', function() {
			assert.equal(true, validateDifficulty(difficulty_1));
		});
	});

	describe('#validateDifficulty(difficulty_2)', function() {
		it('should return true on intermediate difficulty', function() {
			assert.equal(true, validateDifficulty(difficulty_2));
		});
	});

	describe('#validateDifficulty(difficulty_3)', function() {
		it('should return true on hard difficulty', function() {
			assert.equal(true, validateDifficulty(difficulty_3));
		});
	});

	describe('#validateDifficulty(difficulty_4)', function() {
		it('should return false on medium difficulty', function() {
			assert.equal(false, validateDifficulty(difficulty_4));
		});
	});

	describe('#validateDifficulty(difficulty_5)', function() {
		it('should return false on undefined difficulty', function() {
			assert.equal(false, validateDifficulty(difficulty_5));
		});
	});

	describe('#validateDifficulty(difficulty_6)', function() {
		it('should return false on empty string', function() {
			assert.equal(false, validateDifficulty(difficulty_6));
		});
	});

	describe('#validateDifficulty(difficulty_7)', function() {
		it('should return false on integer', function() {
			assert.equal(false, validateDifficulty(difficulty_7));
		});
	});
});
