//app.js

angular
	.module('quizApp', ['ui.router', 'ngMessages', 'ngResource'])
	.controller('mainPageController', mainPageController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.factory('usersData', usersData)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
			.state('main', {
				url: '/main',
				templateUrl: 'templates/firstPage.html',
				controller: 'mainPageController'
			})
			.state('main.index', {
				url: '/index',
				templateUrl: '/templates/firstPageContent.html'
			})
			.state('main.signin', {
				url: '/signin',
				templateUrl: 'templates/signIn.html'
			});

		$urlRouterProvider.otherwise('/main/index');
		$locationProvider.html5Mode(true);
	});