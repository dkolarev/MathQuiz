//checkUsername.js

/**
*	Direktiva provjerava je li 'username' input u 'signIn' formi
*	već zauzet u bazi. Ako je, postavi 'signIn' formu na 'invalid'.
*/
function checkUsername($resource) {
	var resource = $resource('/auth/username/:username', {username: '@username'});
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, controller) {
			element.bind('blur', function(e) {
				if(element.val().length > 0)
					resource.get({username: element.val()}).$promise.then(
						function(response){
							if(response.unique == 'unique')
								controller.$setValidity('unique', true);
							else
								controller.$setValidity('unique', false);
						}, function(response) {
							console.log(response);
						}
					);
			});
		}
	}
};