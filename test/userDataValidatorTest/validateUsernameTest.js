//validateUsernameTest.js

var assert = require('assert');
var validateUsername = require('../../app/data/userDataValidator').validateUsername;

var username_1 = "davor";
var username_2 = "123";
var username_3 = "asd";
var username_4 = "";

describe('validateUsername', function() {
	describe('#validateUsername(username_1)', function() {
		it('should return true on valid username', function() {
			assert.equal(true, validateUsername(username_1));
		});
	});

	describe('#validateUsername(username_2)', function() {
		it('should return false on numbers string', function() {
			assert.equal(false, validateUsername(username_2));
		});
	});

	describe('#validateUsername(username_3)', function() {
		it('should return false on small length string', function() {
			assert.equal(false, validateUsername(username_3));
		});
	});

	describe('#validateUsername(username_4)', function() {
		it('should return false on empty string', function() {
			assert.equal(false, validateUsername(username_4));
		});
	});
});