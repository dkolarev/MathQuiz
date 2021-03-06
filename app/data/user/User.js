//User.js

var User = function(user) {
	this._id = user._id;
	this.username = user.username;
	this.password = user.password;
	this.salt = user.salt;
	this.email = user.email;
	this.joined = user.joined;
};

User.prototype.setJoinedTime = function(time) {
	this.joined = time;
};

module.exports = User;