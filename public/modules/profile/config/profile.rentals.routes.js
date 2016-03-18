'use strict';

angular.module('profile').config([
  '$stateProvider',
  function($stateProvider) {

    var views = 'modules/profile/views/rentals/';

    $stateProvider
      .state('root.profile.rentals', {
        url: '/rentals',
        views: {
          'sidenav-left@': {
            templateUrl: views + 'sidenav-left.html'
          },
          'content@': {
            templateUrl: views + 'index.content.html',
            controller: 'ProfileRentalsCtrl as ctrl'
          },
        }
      })
      .state('root.profile.rentals.new', {
        url: '/new',
        views: {
          'content@': {
            templateUrl: views + 'new.content.html',
            controller: 'ProfileRentalsCreateCtrl as ctrl'
          },
        }
      })
      .state('root.profile.rentals.edit', {
        url: '/{id:int}/edit',
        views: {
          'content@': {
            templateUrl: views + 'new.content.html',
            controller: 'ProfileRentalsEditCtrl as ctrl'
          },
        }
      })
      .state('root.profile.rentals.images', {
        url: '/{id:int}/images',
        views: {
          'content@': {
            templateUrl: views + 'images.content.html',
            controller: 'ProfileRentalsEditCtrl as ctrl'
          },
        }
      });

  }
]);
