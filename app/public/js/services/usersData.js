///usersData.js

function usersData($resource) {
	return {
		signIn: function(user) {
			return $resource('/auth/signin').save(user);
		},

		logIn: function(user) {
			return $resource('/auth/login').save(user);
		}
	}
}