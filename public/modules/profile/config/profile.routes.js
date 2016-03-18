'use strict';

angular.module('profile').config([
  '$stateProvider',
  function($stateProvider) {

    // var views = 'modules/profile/views/';

    $stateProvider
      .state('root.profile', {
        url: 'profile',
      });

  }
]);
