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
	.controller('newQuizController', newQuizController)
	.controller('profileQuizController', profileQuizController)
	.controller('playerController', playerController)
	.controller('questionsController', questionsController)
	.controller('quizzesController', quizzesController)
	.controller('editQuizController', editQuizController)
	.controller('gameEndController', gameEndController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.directive('eqnBind', eqnBind)
	.directive('mathjaxBind', mathjaxBind)
	.directive('dynamicBind', dynamicBind)
	.directive('starRating', starRating)
	.directive('fileModel', fileModel)
	.factory('authService', authService)
	.factory('gameService', gameService)
	.factory('playerService', playerService)
	.factory('modalService', modalService)
	.factory('uploadFile', uploadFile)
	.factory('quizData', quizData)
	.factory('questionData', questionData)
	.factory('correctAnswerService', correctAnswerService)
	.filter('timerFilter', timerFilter)
	.filter('paginationFilter', paginationFilter)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
		$httpProvider.interceptors.push(function($window, $q, $rootScope) {
			return {
				//na svaki request prema serveru u header dodaj korisnikov token i gameId
				request: function(config) {
					// token za autentifikaciju
					var token = $window.localStorage.token;
					// gameId za pristup igri
					var gameId = $window.localStorage.gameId;
					if(token) {
						config.headers['x-auth-token'] = token;
					}
					if (gameId) {
						config.headers['gameid'] = gameId;
					}
					return config;
				},
				/**
				*	ako server vrati 401, digni 'unauthorized' event,
				*	a ako vrati 403 digni 'forbidden' event.
				*/
				responseError: function(response) {
					if (response.status == 401) {
						$rootScope.$emit('unauthorized');
					} else if (response.status == 403) {
						$rootScope.$emit('forbidden');
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
				templateUrl: 'templates/user/user.html',
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
				templateUrl: 'templates/user/userHome.html'
			})
			.state('user.profile', {
				needLogin: true,
				url: '/profile',
				templateUrl: 'templates/user/userProfile.html'
			})
			.state('user.quizzes', {
				needLogin: true,
				url: '/quizzes',
				templateUrl: 'templates/quiz/userQuizzes.html',
				controller: 'quizzesController',
				resolve: {
					data: function(quizData) {
						return quizData.getQuizzes().$promise;
					}
				}
			})
			.state('user.quizprofile', {
				needLogin: true,
				url: '/quizzes/quizprofile/:quizId',
				templateUrl : 'templates/quiz/userQuizProfile.html',
				controller: 'profileQuizController',
				resolve: {
					data: function($stateParams, quizData) {
						return quizData.getQuizWithQuestions($stateParams.quizId).$promise;
					}
				}
			})
			.state('user.newquiz', {
				needLogin: true,
				url: '/quizzes/newquiz',
				templateUrl: 'templates/quiz/userNewQuiz.html',
				controller: 'newQuizController',
				resolve: {
					data: function($stateParams, questionData) {
						return questionData.getQuestions().$promise;
					}
				}
			})
			.state('user.editquiz', {
				needLogin: true,
				url: '/quiz/editquiz/:quizId',
				templateUrl: 'templates/quiz/editQuiz.html',
				controller: 'editQuizController',
				resolve: {
					data: function($stateParams, quizData) {
						return quizData.getQuizById($stateParams.quizId).$promise;
					}
				}
			})
			.state('user.questions', {
				needLogin: true,
				url: '/questions',
				templateUrl: 'templates/question/userQuestions.html',
				controller: 'questionsController',
				resolve: {
					data: function(questionData) {
						return questionData.getQuestions().$promise;
					}
				}
			})
			.state('user.newquestion', {
				needLogin: true,
				url: '/questions/newquestion/:questionId',
				templateUrl: 'templates/question/userNewQuestion.html',
				controller: 'newQuestionController',
				resolve: {
					data: function($stateParams, questionData) {
						return questionData.getQuestionById($stateParams.questionId).$promise;
					}
				}
			})
			.state('createteam', {
				needLogin: false,
				needGameId: true,
				url: '/createteam',
				templateUrl: 'templates/player/createTeam.html',
				controller: 'playerController'
			})
			.state('quizgame', {
				needLogin: false,
				needGameId: false,
				url: '/quizgame',
				templateUrl: 'templates/player/gamePage.html',
				controller: 'playerController'
			})
			.state('quizend', {
				needLogin: false,
				neeGameId: false,
				url: '/quizend',
				templateUrl: 'templates/player/gameEndScreen.html',
				controller: 'gameEndController',
				resolve: {
					data: function(playerService) {
						return playerService.getWinnerData().$promise;
					}
				}
			});

		$urlRouterProvider.otherwise('/index');
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, $state, authService, gameService) {
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			
			/**
			*	Ako je korisnik vec logiran odmah ga
			*	redirektaj na home stranicu ako pokusa
			*	pristupiti pocetnoj stranici.
			*/
			if(toState.name == 'main.index') {
				if (authService.isAuthenticated()) {
					event.preventDefault();
					authService.verifyToken().$promise.then(function(response) {
						$state.go('user.home');
					}, function(response) {
						console.log(response);
					});
				}
			}

			/**
			*	Ako je potrebno biti prijavljen provjeri jel korisnik
			*	ima valjan token. Ako nema, server ce vratiti gresku 401.
			*/
			if (toState.needLogin) {				
				authService.verifyToken().$promise.then(function(response) {
					if(toState.name == 'user') {
						event.preventDefault();
						$state.go('user.home');
					}
				}, function(response) {
					console.log(response);
				});
			} else if (toState.name == 'main') {
				event.preventDefault();
				$state.go('main.index');
			} 
			/**
			*	Ako je za pristup stanju potrebno imati gameId, validiraj
			*	ga na serveru te nastavi ako je sve u redu. U suprotnom
			*	server ce poslati gresku 403.
			*/
			else if (toState.needGameId) {
				gameService.verifyGameId().$promise.then(function(response) {
					// ako je sve u redu ne cini nista
				}, function (response) {
					console.log(response);
				});
			}
		});

		/**
		*	Ako je server vratio 401 gresku (unauthorized)
		*	vrati korisnika na login formu.
		*/
		$rootScope.$on('unauthorized', function(event) {
			event.preventDefault(); //zaustavi
			authService.logOut(function () {
				$state.go('main.login'); //redirektaj na login formu
			});
		});

		/**
		*	Ako je server vratio 403 gresku (forbidden)
		*	vrati korisnika na pocetnu stranicu.
		*/
		$rootScope.$on('forbidden', function (event) {
			event.preventDefault();
			$state.go('main.index');
		});
	});