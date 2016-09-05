//checkEmail.js

/**
*	Direktiva provjerava je li 'email' input u 'signIn' formi
*	već zauzet u bazi. Ako je, postavi 'signIn' formu na 'invalid'.
*/
function checkEmail($resource) {
	var resource = $resource('/api/auth/email/:email', {email: '@email'});
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, controller) {
			element.bind('blur', function(e) {
				if(element.val().length > 0)
					resource.get({email: element.val()}).$promise.then(
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