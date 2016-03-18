'use strict';

module.exports = function(rentalsService){

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


  function create(req, reply) {
    let rental = req.payload;
    rental.ownerId = req.auth.credentials.id;

    return rentalsService.create(rental)
      .then(reply)
      .catch(reply.badRequest.bind(reply));

  }


  function update(req, reply) {
    return rentalsService.update(req.payload)
      .then(reply)
      .catch(reply.badRequest.bind(reply));

  }


  function addImage(req, reply) {

    console.log('request.payload', req.payload);

    return rentalsService.addImage(req.payload.file, req.params.id)
      .then(reply)
      .catch(reply.badRequest.bind(reply));

  }


  return {
    findAll: findAll,
    findOne: findOne,
    create: create,
    update: update,
    addImage: addImage,
  };

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'profile.services/rentals.service',
];
