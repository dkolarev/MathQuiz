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
			
		}
	};
};