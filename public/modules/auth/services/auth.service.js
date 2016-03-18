'use strict';

// Authentication service for user variables
angular.module('auth')
  .factory('AuthService', [
    '$window',
    function($window) {
      var auth = {
        user: $window.user
      };

      return auth;

    }
  ]);
