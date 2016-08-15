//userProfileController.js

function userProfileController($scope, data, gravatarUrlBuilder) {
	$scope.user = data.user;

	$scope.gravatarUrl = gravatarUrlBuilder.buildGravatarUrl(data.user.email);
}