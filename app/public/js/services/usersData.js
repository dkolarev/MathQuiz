///usersData.js

function usersData($resource) {
	return {
		signIn: function(user) {
			return $resource('/check/signin').save(user);
		}
	}
}