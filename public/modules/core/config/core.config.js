'use strict';

angular.module('core').config([
  '$httpProvider',
  '$mdIconProvider',
  function($httpProvider, $mdIconProvider) {

    $httpProvider.defaults.headers.common.Accept = 'application/json';

    $mdIconProvider.icon('menu', 'images/svg/menu.svg', 24);

    $mdIconProvider.defaultFontSet('material-icons');

  }
]);
