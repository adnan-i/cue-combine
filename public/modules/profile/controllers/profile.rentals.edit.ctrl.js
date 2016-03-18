'use strict';

angular.module('profile')
  .controller('ProfileRentalsEditCtrl', [
    'ProfileRentalService',
    '$mdToast',
    '$state',
    function(ProfileRentalService, $mdToast, $state) {
      var ctrl = this;

      ctrl.dropzoneOptions = {
        url: '/profile/rentals/' + $state.params.id + '/image'
      };

      ProfileRentalService.get({id: $state.params.id}).$promise
        .then(function(rental){
          ctrl.rental = rental;
        })
        .catch($mdToast.showSimple);

    }

  ]);
