'use strict';

angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    var views = 'modules/core/views/';

    $stateProvider
      .state('root', {
        url: '/',
        views: {
          header: {
            templateUrl: views + 'core.header.html'
          },
          'sidenav-left': {
            templateUrl: views + 'core.sidenav-left.html'
          },
          content: {
            templateUrl: views + 'core.content.html'
          },
          'sidenav-right': {
            template: ''
          },
          footer: {
            templateUrl: views + 'core.footer.html'
          },
        }
      });


  }
]);
