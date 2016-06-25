//app.js

angular
	.module('quizApp', [
		'ui.router', 
		'ngMessages', 
		'ngResource', 
		'ui.bootstrap', 
		'checklist-model',
		'ngScrollbars'])
	.controller('mainPageController', mainPageController)
	.controller('userController', userController)
	.controller('newQuestionController', newQuestionController)
	.controller('deleteQuestionModalController', deleteQuestionModalController)
	.controller('questionInfoModalController', questionInfoModalController)
	.controller('quizzesController', quizzesController)
	.controller('newQuizController', newQuizController)
	.controller('profileQuizController', profileQuizController)
	.controller('playerController', playerController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.directive('eqnBind', eqnBind)
	.directive('mathjaxBind', mathjaxBind)
	.directive('dynamicBind', dynamicBind)
	.factory('usersData', usersData)
	.factory('authService', authService)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
		$httpProvider.interceptors.push(function($window, $q, $rootScope) {
			return {
				//na svaki request prema serveru u header dodaj korisnikov token
				request: function(config) {
					if($window.localStorage.token) {
						config.headers['x-auth-token'] = $window.localStorage.token;
					}
					return config;
				},
				//ako server vrati 401 ili 403 gresku, digni 'unauthorized' event
				responseError: function(response) {
					if (response.status == 401 || response.status == 403) {
						$rootScope.$emit('unauthorized');
					}
					return $q.reject(response);
				}
			}
		});

		//angular rute
		$stateProvider
			.state('main', {
				needLogin: false,
				url: '/',
				templateUrl: 'templates/firstPage.html',
				controller: 'mainPageController'
			})
			.state('main.index', {
				needLogin: false,
				url: 'index',
				templateUrl: '/templates/firstPageContent.html'
			})
			.state('main.signin', {
				needLogin: false,
				url: 'signin',
				templateUrl: 'templates/signIn.html'
			})
			.state('main.login', {
				needLogin: false,
				url: 'login',
				templateUrl: 'templates/logIn.html'
			})
			.state('user', {
				needLogin: true,
				url: '/user',
				templateUrl: 'templates/user.html',
				controller: 'userController',
				resolve: {
					data: function($resource) {
						return $resource('/api/getdata').get().$promise;
					}
				}
			})
			.state('user.home', {
				needLogin: true,
				url: '/home',
				templateUrl: 'templates/userHome.html'
			})
			.state('user.profile', {
				needLogin: true,
				url: '/profile',
				templateUrl: 'templates/userProfile.html'
			})
			.state('user.quizzes', {
				needLogin: true,
				url: '/quizzes',
				templateUrl: 'templates/userQuizzes.html',
				controller: 'quizzesController'
			})
			.state('user.quizprofile', {
				needLogin: true,
				url: '/quizzes/quizprofile/:quizId',
				templateUrl : 'templates/userQuizProfile.html',
				controller: 'profileQuizController'
			})
			.state('user.newquiz', {
				needLogin: true,
				url: '/quizzes/newquiz/:quizId',
				templateUrl: 'templates/userNewQuiz.html',
				controller: 'newQuizController'
			})
			.state('user.questions', {
				needLogin: true,
				url: '/questions',
				templateUrl: 'templates/userQuestions.html'
			})
			.state('user.newquestion', {
				needLogin: true,
				url: '/questions/newquestion/:questionId',
				templateUrl: 'templates/userNewQuestion.html',
				controller: 'newQuestionController'
			})
			.state('createteam', {
				needLogin: false,
				url: '/createteam',
				templateUrl: 'templates/createTeam.html',
				controller: 'playerController'
			});

		$urlRouterProvider.otherwise('/index');
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, authService, $state) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			/**
			*	Ako je potrebno biti prijavljen provjeri jel korisnik
			*	ima valjan token. Ako nema, server ce vratiti gresku 401.
			*/
			if(toState.needLogin) {				
				authService.verifyToken().$promise.then(function(response) {
					if(toState.name == 'user') {
						event.preventDefault();
						$state.go('user.home');
					}
				}, function(response) {
					console.log(response);
				});
			} else if(toState.name == 'main') {
				event.preventDefault();
				$state.go('main.index');
			}
		});

		/**
		*	Ako je server vratio 401 ili 403 gresku (unauthorized)
		*	vrati korisnika na login formu.
		*/
		$rootScope.$on('unauthorized', function(event) {
			event.preventDefault(); //zaustavi
			authService.logOut(function () {
				$state.go('main.login'); //redirektaj na login formu
			});
		});
	});