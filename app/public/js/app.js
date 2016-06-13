//app.js

angular
	.module('quizApp', ['ui.router', 'ngMessages', 'ngResource'])
	.controller('mainPageController', mainPageController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.factory('usersData', usersData)
	.factory('verifyLogin', verifyLogin)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider){
		$stateProvider
			.state('main', {
				needLogin: false,
				url: '/main',
				templateUrl: 'templates/firstPage.html',
				controller: 'mainPageController'
			})
			.state('main.index', {
				needLogin: false,
				url: '/index',
				templateUrl: '/templates/firstPageContent.html'
			})
			.state('main.signin', {
				needLogin: false,
				url: '/signin',
				templateUrl: 'templates/signIn.html'
			})
			.state('main.login', {
				needLogin: false,
				url: '/login',
				templateUrl: 'templates/logIn.html'
			})
			.state('user', {
				needLogin: true,
				url: '/user',
				templateUrl: 'templates/userHome.html'
			});

		$urlRouterProvider.otherwise('/main/index');
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, verifyLogin, $state) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			/**
			*	Ako je potrebno biti prijavljen zaustavi i redirektaj
			*	na login formu.
			*/
			if(toState.needLogin) {
				if(verifyLogin.isAuth == false) {
					console.log("You must login.");
					event.preventDefault(); //zaustavi pristup ruti
					$state.go('main.login'); //redirektaj na login
				};
			}
		});
	});