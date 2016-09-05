//userData.js

function userData($resource) {
	return {
		getUserByUsername: function(username) {
			return $resource('/api/user/:username', {username: '@username'})
					.get({username: username});
		},

		getActiveGames: function() {
			return $resource('/api/user/game').get();
		}
	};
}