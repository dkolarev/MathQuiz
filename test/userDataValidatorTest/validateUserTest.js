//validateUserTest.js

var assert = require('assert');
var validateUser = require('../../app/data/userDataValidator').validateUser;

var user_1 = {
	username: "davor",
	password: "123456",
	email: "davor.kolarevic@gmail.com"
};

var user_2 = {
	username: "",
	password: "123456",
	email: "davor.kolarevic@gmail.com"
};

var user_3 = {
	username: "davor",
	password: 123456,
	email: "davor.kolarevic@gmail.com"
};

var user_4 = {
	username: "davor",
	password: "123456",
	email: "davor.kolarevic"
};

describe('validateUser', function() {
	describe('#validateUser(user_1)', function() {
		it('should return true on valid user', function() {
			assert.equal(true, validateUser(user_1));
		});
	});

	describe('#validateUser(user_2)', function() {
		it('should return false on user with invalid username', function() {
			assert.equal(false, validateUser(user_2));
		});
	});

	describe('#validateUser(user_3)', function() {
		it('should return false on user with invalid password', function() {
			assert.equal(false, validateUser(user_3));
		});
	});

	describe('#validateUser(user_4)', function() {
		it('should return false on user with invalid email', function() {
			assert.equal(false, validateUser(user_4));
		});
	});
});