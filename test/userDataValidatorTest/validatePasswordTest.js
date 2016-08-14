//validatePasswordTest.js

var assert = require('assert');
var validatePassword = require('../../app/data/userDataValidator').validatePassword;

var password_1 = "123456";
var password_2 = "123";
var password_3 = 123;
var password_4 = "";

describe('validatePassword', function() {
	describe('#validatePassword(password_1)', function() {
		it('should return true on valid password', function() {
			assert.equal(true, validatePassword(password_1));
		});
	});

	describe('#validatePassword(password_2)', function() {
		it('should return false on small password', function() {
			assert.equal(false, validatePassword(password_2));
		});
	});

	describe('#validatePassword(password_3)', function() {
		it('should return false on invalid input password', function() {
			assert.equal(false, validatePassword(password_3));
		});
	});

	describe('#validatePassword(password_4)', function() {
		it('should return false on empty string', function() {
			assert.equal(false, validatePassword(password_4));
		});
	});
});