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
	.controller('userGamePendingController', userGamePendingController)
	.controller('userGameController', userGameController)
	.controller('userGameEndController', userGameEndController)
	.controller('editQuestionController', editQuestionController)
	.controller('editQuizController', editQuizController)
	.controller('dissolveGameModalController', dissolveGameModalController)
	.controller('mathFunctionsController', mathFunctionsController)
	.directive('checkUsername', checkUsername)
	.directive('checkPassword', checkPassword)
	.directive('checkEmail', checkEmail)
	.directive('eqnBind', eqnBind)
	.directive('mathjaxBind', mathjaxBind)
	.directive('dynamicBind', dynamicBind)
	.directive('fileModel', fileModel)
	.directive('restrictAccess', restrictAccess)
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
					//teamId u igri
					var teamId = $window.localStorage.teamId;

					if(token) {
						config.headers['x-auth-token'] = token;
					}
					if (gameId) {
						config.headers['gameid'] = gameId;
					}
					if (teamId) {
						config.headers['teamid'] = teamId;
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
				templateUrl: 'templates/firstPage.html',
				controller: 'mainPageController'
			})
			.state('main.index', {
				needLogin: false,
				url: '/',
				templateUrl: '/templates/firstPageContent.html'
			})
			.state('main.signup', {
				needLogin: false,
				url: 'signup',
				templateUrl: 'templates/signUp.html'
			})
			.state('main.login', {
				needLogin: false,
				url: 'login',
				templateUrl: 'templates/logIn.html'
			})
			.state('user', {
				needLogin: true,
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
				url: '/quiz/new',
				templateUrl: 'templates/quiz/newQuiz.html',
				controller: 'newQuizController',
				resolve: {
					data: function(questionResource) {
						return questionResource.getQuestionsList(10).$promise;
					}
				}
			})
			.state('user.editquiz', {
				needLogin: true,
				url: '/quiz/edit/:quizId',
				templateUrl: 'templates/quiz/newQuiz.html',
				controller: 'editQuizController',
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
				url: '/question/new',
				templateUrl: 'templates/question/newQuestion.html',
				controller: 'newQuestionController'
			})
			.state('user.editquestion', {
				needLogin: true,
				url: '/question/edit/:questionId',
				templateUrl: 'templates/question/newQuestion.html',
				controller: 'editQuestionController',
				resolve: {
					data: function($stateParams, questionResource) {
						return questionResource.getQuestionById($stateParams.questionId).$promise;
					}
				}
			})
			.state('user.gamepending', {
				needLogin: true,
				url: '/game/pending/:gameId',
				templateUrl: 'templates/user/userGamePending.html',
				controller: 'userGamePendingController',
				resolve: {
					data: function(gameResource, $stateParams) {
						return gameResource.getSignedTeams($stateParams.gameId).$promise;
					}
				}
			})
			.state('user.game', {
				needLogin: true,
				url: '/game/playing/:gameId',
				templateUrl: 'templates/user/userGame.html',
				controller: 'userGameController',
				resolve: {
					data: function(gameResource, $stateParams) {
						return gameResource.getQuiz($stateParams.gameId).$promise;
					}
				}
			})
			.state('user.gameend', {
				needLogin: true,
				url: '/game/end/:gameId',
				templateUrl: 'templates/user/userGameEnd.html',
				controller: 'userGameEndController',
				resolve: {
					data: function(gameResource, $stateParams) {
						return gameResource.getWinnerData($stateParams.gameId).$promise;
					}
				}
			})
			.state('createteam', {
				needLogin: false,
				needGameId: false,
				url: '/createteam',
				templateUrl: 'templates/player/createTeam.html',
				controller: 'createTeamController',
				resolve: {
					data: function(gameResource) {
						return gameResource.getGameStatus().$promise;
					}
				}
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

		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);
	})
	.run(function($rootScope, $state, authService, gameService, gameService) {
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
				} else if (gameService.getGameId()) {
					gameService.verifyGameId().$promise.then(function(response) {
						$state.go('createteam');
					}, function(response) {
						gameService.deleteGameId();
						gameService.deleteTeamId();
					});
				}
			}

			/**
			*	Ako je potrebno biti prijavljen provjeri jel korisnik
			*	ima valjan token. Ako nema, server ce vratiti gresku 401.
			*/
			if (toState.needLogin) {			
				authService.verifyToken().$promise.then(function(response) {
				}, function(response) {
					console.log(response);
				});
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
			gameService.deleteGameId();
			gameService.deleteTeamId();
			$state.go('main.index');
		});
	});