//validateTimeTest.js

var assert = require('assert');
var validateTime = require('../../app/data/questionDataValidator').validateTime;

var time_1 = 5;
var time_2 = null;
var time_3 = -5;
var time_4 = 5.2;

describe('validateTime', function() {
	describe('#validateTime(time_1)', function() {
		it('should return true on 5', function() {
			assert.equal(true, validateTime(time_1));
		});
	});

	describe('#validateTime(time_2)', function() {
		it('should return false on empty variable', function() {
			assert.equal(false, validateTime(time_2));
		});
	});

	describe('#validateTime(time_3)', function() {
		it('should return false on negative number', function() {
			assert.equal(false, validateTime(time_3));
		});
	});

	describe('#validateTime(time_4)', function() {
		it('should return false on decimal number', function() {
			assert.equal(false, validateTime(time_4));
		});
	});
});