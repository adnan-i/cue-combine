'use strict';

const path = require('path');
// const Joi = require('joi');

module.exports = function(ctrl) {

  let routes = [{
    path: '',
    method: 'GET',
    config: {
      handler: ctrl.findAll,
      auth: false,
    }
  }, {
    path: '/{id}',
    method: 'GET',
    config: {
      handler: ctrl.findOne,
      auth: false,
    }
  }];


  return function(options){
    let prefix = options && options.prefix || '/rentals';
    routes.forEach(function(route) {
      route.path = path.join(prefix, route.path);
    });
    return routes;
  };

};

module.exports['@singleton'] = true;
module.exports['@require'] = [
  'rentals.controllers/rentals.ctrl',
];
