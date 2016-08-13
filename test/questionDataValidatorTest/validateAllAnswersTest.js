//validateAllAnswersTest.js

var assert = require('assert');
var validateAllAnswers = require('../../app/data/questionDataValidator').validateAllAnswers;

var answers_1 = {};
var answers_2 = {"answer1": "answer1", 
				 "answer2": "answer2", 
				 "answer3": "answer3", 
				 "answer4": "answer4"};

var answers_3 = {"answer1": "answer1", 
				 "answer2": 2, 
				 "answer3": "answer_2", 
				 "answer4": "answer_3"};

describe('validateAllAnswers', function() {
	describe('#validateAllAnswers(answers_1)', function() {
		it ('should return false on empty list', function() {
			assert.equal(false, validateAllAnswers(answers_1));
		});
	});

	describe('#validateAllAnswers(answers_2)', function() {
		it ('should return true', function() {
			assert.equal(true, validateAllAnswers(answers_2));
		});
	});

	describe('#validateAllAnswers(answers_3)', function() {
		it ('should return false on invalid element in list', function() {
			assert.equal(false, validateAllAnswers(answers_3));
		});
	});
});