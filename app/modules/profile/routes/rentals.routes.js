'use strict';

const path = require('path');
const Joi = require('joi');

module.exports = function(ctrl) {

  let routes = [{
    path: '/rentals',
    method: 'GET',
    config: {
      handler: ctrl.findAll,
      auth: 'session',
    }
  }, {
    path: '/rentals',
    method: 'POST',
    config: {
      handler: ctrl.create,
      auth: 'session',
      validate: {
        payload: Joi.object({
          name: Joi.string().max(30).required(),
          type: Joi.any().valid('apartment', 'house')
        }).required().length(2)
      }
    }
  }, {
    path: '/rentals/{id}',
    method: 'GET',
    config: {
      handler: ctrl.findOne,
      auth: 'session',
    }
  }, {
    path: '/rentals/{id}',
    method: ['PUT', 'POST'],
    config: {
      handler: ctrl.update,
      auth: 'session',
    }
  }, {
    path: '/rentals/{id}/image',
    method: 'POST',
    config: {
      payload: {
        output: 'file',
        maxBytes: 209715200,
        allow: 'multipart/form-data',
        // parse: true //or just remove this line since true is the default
      },
      handler: ctrl.addImage,
      auth: 'session',
    }
  }];


  return function(options){
    let prefix = options && options.prefix || '/profile';
    routes.forEach(function(route) {
      route.path = path.join(prefix, route.path);
    });
    return routes;
  };

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'profile.controllers/rentals.ctrl',
];
