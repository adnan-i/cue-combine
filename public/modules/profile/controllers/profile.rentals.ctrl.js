'use strict';

angular.module('profile')
  .controller('ProfileRentalsCtrl', [
    'ProfileRentalService',
    '$mdToast',
    function(ProfileRentalService, $mdToast) {
      var ctrl = this;

      ProfileRentalService.findAll().$promise
        .then(function(rentals){
          ctrl.rentals = rentals;
        })
        .catch($mdToast.showSimple);

    }
  ]);
