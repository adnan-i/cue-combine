/* global Dropzone: false */
'use strict';

angular.module('core')
  .directive('dropzone', [
    function() {

      // Dropzone.autoDiscover = false;

      return {
        restrict: 'A',
        scope: {
          options: '=dzOptions'
        },
        link: function($scope, $element){
          var drop = new Dropzone($element[0], $scope.options);

        }
      };

    }
  ]);
