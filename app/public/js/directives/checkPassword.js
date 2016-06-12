//checkPassword.js


/**
*	Direktiva provjerava je li unesena
*	lozinka jednaka u prvom i drugom polju
*	SignIn forme.
*/
function checkPassword(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, controller) {
			element.bind('blur', function(e) {
				if(scope.password != element.val()){
					controller.$setValidity('correct', false);
				}
				else{
					controller.$setValidity('correct', true);
				}
			});
		},
		scope: {
			password: "=password"
		}
	};
};