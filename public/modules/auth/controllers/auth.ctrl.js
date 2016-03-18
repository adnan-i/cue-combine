'use strict';

angular.module('auth')
  .controller('AuthController', [
    '$scope',
    '$http',
    '$location',
    'AuthService',
    function($scope, $http, $location, Auth) {
      var ctrl = this;

      ctrl.user = {};

      // If user is signed in then redirect back home
      if (Auth.user) {
        $location.path('/');
      }

      ctrl.signup = function() {

        $http.post('/auth/signup', ctrl.user).success(function(response) {
          // If successful we assign the response to the global user model
          Auth.user = response;

          // And redirect to the index page
          $location.path('/');
        }).error(function(response) {
          console.error(response);
        });
      };


      ctrl.signin = function() {
        $http.post('/auth/signin', ctrl.user).success(function(response) {
          // If successful we assign the response to the global user model
          Auth.user = response;

          // And redirect to the index page
          $location.path('/');
        }).error(function(response) {
          console.error(response);
        });
      };


    }

  ]);
