'use strict';

module.exports = function rentalsCtrl(rentalsService){

  function findAll(req, reply){
    return rentalsService.findAll()
      .then(reply)
      .catch(reply.badRequest.bind(reply));

  }


  function findOne(req, reply){

    let whereOptions = {
      where: {
        id: req.params.id
      }
    };

    return rentalsService.findOne(whereOptions)
      .then(reply)
      .catch(reply.badRequest.bind(reply));

  }


  return {
    findAll: findAll,
    findOne: findOne,
  };

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'rentals.services/rentals.service',
];
