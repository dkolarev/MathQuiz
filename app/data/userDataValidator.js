//userDataValidator.js

var validateUsername = function (username) {
	if (typeof username === "undefined") return false;
	if (typeof username !== "string") return false;
	if (username === "") return false;
	if (username.length < 5) return false;

	var regex = /^[0-9]*[A-Za-z][A-Za-z0-9]*$/;

	return regex.test(username);
}

var validatePassword = function (password) {
	if (typeof password === "undefined") return false;
	if (typeof password !== "string") return false;
	if (password === "") return false;
	if (password.length < 6) return false;

	return true;
}

var validateEmail = function (email) {
	if (typeof email === "undefined") return false;
	if (typeof email !== "string") return false;
	if (email === "") return false;

	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return regex.test(email);
}

var validateUser = function(user) {
	if (!validateUsername(user.username)) return false;
	if (!validatePassword(user.password)) return false;
	if (!validateEmail(user.email)) return false;

	return true;
}

module.exports = {
	validateUsername: validateUsername,
	validatePassword: validatePassword,
	validateEmail: validateEmail,
	validateUser: validateUser
};