'use strict';

angular.module('profile')
  .factory('ProfileRentalService', ['$resource',
    function($resource) {
      return $resource('profile/rentals/:id/:action', {
        id: '@id'
      }, {
        update: {
          method: 'PUT'
        },
        findAll: {
          method: 'GET',
          isArray: true,
        }
      });
    }
  ]);
