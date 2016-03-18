'use strict';

angular.module('profile')
  .controller('ProfileRentalsCreateCtrl', [
    'ProfileRentalService',
    '$mdToast',
    function(ProfileRentalService, $mdToast) {
      var ctrl = this;

      ctrl.rental = new ProfileRentalService();

      ctrl.save = function(){
        return ctrl.rental.$save()
          .then(function(){
            $mdToast.showSimple('Rental created.');
          })
          .catch($mdToast.showSimple);

      };

    }

  ]);
