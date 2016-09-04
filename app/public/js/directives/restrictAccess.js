/**
*	Removes taged HTML element from user view
*	if user is not administrator.
*/
function restrictAccess(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs, controller){
			if(scope.user !== scope.createdBy){
				element.children().remove();
				element.remove();
			}
		},
		scope: {
			user: "=user",
			createdBy: "=createdBy"
		}
	};
};