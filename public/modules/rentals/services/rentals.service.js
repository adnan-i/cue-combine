'use strict';

angular.module('rentals')
  .factory('RentalService', ['$resource',
    function($resource) {
      return $resource('rentals/:id/:action', {
        id: '@id'
      }, {
        findAll: {
          method: 'GET',
          isArray: true,
        }
      });
    }
  ]);
