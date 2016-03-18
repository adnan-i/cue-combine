'use strict';
angular.module('rentals').config(['$stateProvider',
  function($stateProvider) {

    var views = 'modules/rentals/views/';

    $stateProvider
      .state('root.rentals', {
        url: 'rentals',
        views: {
          'sidenav-left@': {
            templateUrl: views + 'rentals.sidenav-left.html'
          },
          'content@': {
            templateUrl: views + 'rentals.content.html',
            controller: 'RentalsCtrl as ctrl'
          },
        }
      });

  }
]);
