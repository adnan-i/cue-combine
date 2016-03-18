'use strict';

angular.module('auth').config([
  '$stateProvider',
  function($stateProvider) {

    var views = 'modules/auth/views/';

    $stateProvider
      .state('root.auth', {
        url: 'auth',
      })
      .state('root.auth.signup', {
        url: '/signup',
        views: {
          'body@': {
            templateUrl: views + 'signup.body.html',
            controller: 'AuthController as ctrl'
          }
        }
      })
      .state('root.auth.signin', {
        url: '/signin',
        views: {
          'body@': {
            templateUrl: views + 'signin.body.html',
            controller: 'AuthController as ctrl'
          }
        }
      });


  }
]);
