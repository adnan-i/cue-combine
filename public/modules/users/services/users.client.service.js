'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users')
  .factory('UserService', [
    '$resource',
    function($resource) {
      return $resource('users/:id/:action', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        }
      });
    }
  ]);
