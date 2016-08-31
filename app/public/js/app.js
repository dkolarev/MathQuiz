//app.js

angular
	.module('quizApp', [
		'ui.router', 
		'ngMessages', 
		'ngResource', 
		'ui.bootstrap', 
		'checklist-model',
		'ngScrollbars',
		'angularUtils.directives.dirPagination'])
	.controller('mainPageController', mainPageController)
	.controller('userController', userController)
	.controller('newQuestionController', newQuestionController)
	.controller('deleteQuestionModalController', deleteQuestionModalController)
	.controller('questionInfoModalController', questionInfoModalController)
	.controller('newQuizController', newQuizController)
	.controller('profileQuizController', profileQuizController)
	.controller('createTeamController', createTeamController)
	.controller('questionListController', questionListController)
	.controller('quizListController', quizListController)
	.controller('gameEndController', gameEndController)
	.controller('userProfileController', userProfileController)
	.controller('userHomeController', userHomeController)
	.controller('deleteQuizModalController', deleteQuizModalController)
	.controller('gameController', gameController)
	.controller('gamePendingController', gamePendingController)
	.controller('spectatorController', spectatorController)
	.controller('spectatorEndController', spectatorEndController)
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
	.factory('gameResource', gameResource)
	.factory('modalService', modalService)
	.factory('uploadFile', uploadFile)
	.factory('quizResource', quizResource)
	.factory('questionResource', questionResource)
	.factory('correctAnswerService', correctAnswerService)
	.factory('userData', userData)
	.factory('gravatarUrlBuilder', gravatarUrlBuilder)
	.factory('enumData', enumData)
	.factory('questionFilterService', questionFilterService)
	.factory('quizFilterService', quizFilterService)
	.filter('timerFilter', timerFilter)
	.filter('paginationFilter', paginationFilter)
	.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
		$httpProvider.interceptors.push(function($window, $q, $rootScope) {
			return {
				//na svaki request prema serveru u header dodaj korisnikov token ili gameId
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
					if (response.status === 401) {
						$rootScope.$emit('unauthorized');
					} else if (response.status === 403) {
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
				controller: 'userController'
			})
			.state('user.home', {
				needLogin: true,
				url: '/home',
				templateUrl: 'templates/user/userHome.html',
				controller: 'userHomeController',
				resolve: {
					data: function(userData) {
						return userData.getActiveGames().$promise;
					}
				}
			})
			.state('user.profile', {
				needLogin: true,
				url: '/profile/:username',
				templateUrl: 'templates/user/userProfile.html',
				controller: 'userProfileController',
				resolve: {
					data: function($stateParams, userData) {
						return userData.getUserByUsername($stateParams.username).$promise;
					} 
				}
			})
			.state('user.quizlist', {
				needLogin: true,
				url: '/quiz/list',
				templateUrl: 'templates/quiz/quizList.html',
				controller: 'quizListController',
				resolve: {
					data: function(quizResource) {
						return quizResource.getQuizzesList().$promise;
					}
				}
			})
			.state('user.quizprofile', {
				needLogin: true,
				url: '/quiz/quizprofile/:quizId',
				templateUrl : 'templates/quiz/quizProfile.html',
				controller: 'profileQuizController',
				resolve: {
					data: function($stateParams, quizResource) {
						return quizResource.getQuizWithQuestions($stateParams.quizId).$promise;
					}
				}
			})
			.state('user.newquiz', {
				needLogin: true,
				url: '/quiz/newquiz/:quizId',
				templateUrl: 'templates/quiz/newQuiz.html',
				controller: 'newQuizController',
				resolve: {
					data: function(questionResource) {
						return questionResource.getQuestionsList(10).$promise;
					},
					quiz: function($stateParams, quizResource) {
						return quizResource.getQuizById($stateParams.quizId).$promise;
					}
				}
			})
			.state('user.questionlist', {
				needLogin: true,
				url: '/question/list',
				templateUrl: 'templates/question/questionsList.html',
				controller: 'questionListController',
				resolve: {
					data: function(questionResource) {
						return questionResource.getQuestionsList().$promise;
					}
				}
			})
			.state('user.newquestion', {
				needLogin: true,
				url: '/question/newquestion/:questionId',
				templateUrl: 'templates/question/newQuestion.html',
				controller: 'newQuestionController',
				resolve: {
					data: function($stateParams, questionResource) {
						return questionResource.getQuestionById($stateParams.questionId).$promise;
					}
				}
			})
			.state('createteam', {
				needLogin: false,
				needGameId: true,
				url: '/createteam',
				templateUrl: 'templates/player/createTeam.html',
				controller: 'createTeamController'
			})
			.state('quizgame', {
				needLogin: false,
				needGameId: true,
				url: '/quizgame',
				templateUrl: 'templates/player/gamePage.html',
				controller: 'gameController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getQuiz().$promise;
					}
				}
			})
			.state('quizend', {
				needLogin: false,
				needGameId: true,
				url: '/quizend',
				templateUrl: 'templates/player/gameEndScreen.html',
				controller: 'gameEndController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getWinnerData().$promise;
					}
				}
			})
			.state('spectatorpending', {
				needLogin: false,
				needGameId: true,
				url: '/spectator/pending',
				templateUrl: 'templates/spectator/gamePending.html',
				controller: 'gamePendingController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getSignedTeams().$promise;
					}
				}
			})
			.state('spectatorgame', {
				needLogin: false,
				needGameId: true,
				url: '/spectator/game',
				templateUrl: 'templates/spectator/spectatorGame.html',
				controller: 'spectatorController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getQuiz().$promise;
					}
				}
			})
			.state('spectatorend', {
				needLogin: false,
				needGameId: true,
				url: '/spectator/end',
				templateUrl: 'templates/spectator/spectatorEndScreen.html',
				controller: 'spectatorEndController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getWinnerData().$promise;
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
			if(toState.name === 'main.index') {
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
					if(toState.name === 'user') {
						event.preventDefault();
						$state.go('user.home');
					}
				}, function(response) {
					console.log(response);
				});
			} else if (toState.name === 'main') {
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