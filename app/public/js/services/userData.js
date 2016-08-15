//userData.js

function userData($resource) {
	return {
		getUserByUsername: function(username) {
			return $resource('/api/user/:username', {username: '@username'})
					.get({username: username});
		}
	};
}