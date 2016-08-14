//validateEmailTest.js

var assert = require('assert');
var validateEmail = require('../../app/data/userDataValidator').validateEmail;

var email_1 = "davor.kolarevic@gmail.com";
var email_2 = "wrong.input";
var email_3 = "wrong.input@gmail";
var email_4 = "wrong.input@";
var email_5 = 2123;
var email_6 = "";

describe('validateEmail', function() {
	describe('#validateEmail(email_1)', function() {
		it('should return true on valid email', function() {
			assert.equal(true, validateEmail(email_1));
		});
	});

	describe('#validateEmail(email_2)', function() {
		it('should return false on invalid email', function() {
			assert.equal(false, validateEmail(email_2));
		});
	});

	describe('#validateEmail(email_3)', function() {
		it('should return false on invalid email', function() {
			assert.equal(false, validateEmail(email_3));
		});
	});

	describe('#validateEmail(email_4)', function() {
		it('should return false on invalid email', function() {
			assert.equal(false, validateEmail(email_4));
		});
	});

	describe('#validateEmail(email_5)', function() {
		it('should return false on invalid input', function() {
			assert.equal(false, validateEmail(email_5));
		});
	});

	describe('#validateEmail(email_6)', function() {
		it('should return false on empty string', function() {
			assert.equal(false, validateEmail(email_6));
		});
	});
});