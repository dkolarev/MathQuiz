//app.js

angular
	.module('quizApp', ['ui.router', 'ngMessages', 'ngResource'])
	.controller('mainPageController', mainPageController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.factory('usersData', usersData)
	.factory('authService', authService)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
		$httpProvider.interceptors.push(function($window, $q, $rootScope) {
			return {
				request: function(config) {
					if($window.localStorage.token) {
						config.headers['x-auth-token'] = $window.localStorage.token;
					}
					return config;
				},
				responseError: function(response) {
					if (response.status == 401 || response.status == 403) {
						$rootScope.$emit('unauthorized');
					}
					return $q.reject(response);
				}
			}
		});

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
			})
			.state('api', {
				needLogin: true,
				url: '/api',
				templateUrl: 'templates/userHome.html'
			})

		$urlRouterProvider.otherwise('/main/index');
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, authService, $state, usersData) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			/**
			*	Ako je potrebno biti prijavljen provjeri jel korisnik
			*	ima valjan token. Ako nema, server ce vratiti gresku 401.
			*/
			
			if(toState.needLogin) {				
				authService.checkToken().$promise.then(function(response) {
					//console.log(response);
				}, function(response) {
					console.log(response);
				});
			} else if(toState.name == 'main') {
				event.preventDefault();
				$state.go('main.index');
			}
		});

		$rootScope.$on('unauthorized', function(event) {
			event.preventDefault(); //zaustavi
			$state.go('main.login'); //redirektaj na login formu
		})
	});