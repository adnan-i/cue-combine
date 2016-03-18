'use strict';

angular.module('rentals')
  .controller('RentalsCtrl', [
    'RentalService',
    '$mdToast',
    function(RentalService, $mdToast) {
      var ctrl = this;

      RentalService.findAll().$promise
        .then(function(rentals){
          ctrl.rentals = rentals.slice(0, 10);
        })
        .catch($mdToast.showSimple);

    }
  ]);
